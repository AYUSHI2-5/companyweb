import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_capture_all_pages_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9262',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9262/json/version');
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
  const targetId = targetRes.result.targetId;
  const attachRes = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const pages = [
    { file: 'about.html', name: 'about' },
    { file: 'services.html', name: 'services' },
    { file: 'portfolio.html', name: 'portfolio' },
    { file: 'contact.html', name: 'contact' }
  ];

  for (const p of pages) {
    await sendSession('Page.navigate', { url: `http://localhost:3000/${p.file}` });
    await new Promise(r => setTimeout(r, 1200));

    // Top shot
    const topSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/snap_verify_${p.name}_top.png`, Buffer.from(topSnap.result.data, 'base64'));

    // Mid shot
    await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, 1000);` });
    await new Promise(r => setTimeout(r, 400));
    const midSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/snap_verify_${p.name}_mid.png`, Buffer.from(midSnap.result.data, 'base64'));

    // Footer shot
    await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, document.documentElement.scrollHeight);` });
    await new Promise(r => setTimeout(r, 400));
    const botSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/snap_verify_${p.name}_bot.png`, Buffer.from(botSnap.result.data, 'base64'));

    // Scroll back to top
    await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await new Promise(r => setTimeout(r, 400));
    const backSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/snap_verify_${p.name}_back_top.png`, Buffer.from(backSnap.result.data, 'base64'));

    console.log(`Captured verification shots for ${p.file}`);
  }

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

