import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_approach_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9249',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9249/json/version');
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
      pending.set(msgId, sessionId, resolve); // wait! pending map needs msgId!
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');

  // 1. Desktop viewport (1440x900)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  const evalRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('our-approach');
      if (!el) return { found: false };
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - 80;
      window.scrollTo(0, top);
      return { found: true, top, rectTop: rect.top, offsetTop: el.offsetTop };
    })()`,
    returnByValue: true
  });
  console.log('Desktop eval result:', JSON.stringify(evalRes.result?.value));

  await new Promise(r => setTimeout(r, 1000));

  const desktopSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_our_approach_desktop.png', Buffer.from(desktopSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_our_approach_desktop.png');

  // 2. Mobile viewport (390x844)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('our-approach');
      if (el) {
        const rect = el.getBoundingClientRect();
        window.scrollTo(0, rect.top + window.scrollY - 70);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_our_approach_mobile.png', Buffer.from(mobileSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_our_approach_mobile.png');

  ws.close();
} catch (e) {
  console.error('Error during verification:', e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}
