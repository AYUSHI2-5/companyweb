import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_audit_' + Date.now();
const port = 9279;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const targetRes = await send('Target.createTarget', { url: 'about:blank' });
  const attachRes = await send('Target.attachToTarget', { targetId: targetRes.result.targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sessionSend(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sessionSend('Page.enable');
  await sessionSend('Runtime.enable');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const pages = [
    { name: 'homepage', url: 'file:///c:/Users/Admin/Desktop/Baadam.com/index.html' },
    { name: 'services', url: 'file:///c:/Users/Admin/Desktop/Baadam.com/services.html' },
    { name: 'portfolio', url: 'file:///c:/Users/Admin/Desktop/Baadam.com/portfolio.html' },
    { name: 'about', url: 'file:///c:/Users/Admin/Desktop/Baadam.com/about.html' },
    { name: 'contact', url: 'file:///c:/Users/Admin/Desktop/Baadam.com/contact.html' }
  ];

  for (const page of pages) {
    console.log(`Auditing: ${page.name} (${page.url})`);
    let consoleErrors = [];

    // Capture console API calls
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text);
      }
    });

    await sessionSend('Page.navigate', { url: page.url });
    await new Promise(r => setTimeout(r, 1500));

    // Capture screenshot
    const shot = await sessionSend('Page.captureScreenshot', { format: 'png' });
    const outPath = `scratch/audit_${page.name}.png`;
    fs.writeFileSync(outPath, Buffer.from(shot.result.data, 'base64'));
    console.log(`  Saved screenshot: ${outPath} (${fs.statSync(outPath).size} bytes)`);

    if (consoleErrors.length > 0) {
      console.error(`  Console errors on ${page.name}:`, consoleErrors);
    } else {
      console.log(`  Zero console errors on ${page.name}!`);
    }
  }

  console.log('\nAudit complete across all 5 pages!');
} catch (err) {
  console.error('Audit error:', err);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
