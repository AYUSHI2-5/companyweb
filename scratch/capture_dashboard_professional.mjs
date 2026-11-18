import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_dashprof_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9388',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9388/json/version');
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
  await sendSession('Runtime.enable');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Login
  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/admin/login.html' });
  await new Promise(r => setTimeout(r, 1200));
  await sendSession('Runtime.evaluate', {
    expression: `
      document.getElementById('username').value = 'admin';
      document.getElementById('password').value = 'Baadam@2026';
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to Dashboard
  console.log('Navigating to http://127.0.0.1:8080/admin/dashboard.html...');
  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/admin/dashboard.html' });
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot top viewport
  const shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/admin_dashboard_professional.png', Buffer.from(shot1.result.data, 'base64'));
  console.log('Saved admin_dashboard_professional.png');

  // Full page screenshot
  const metrics = await sendSession('Page.getLayoutMetrics');
  const fullHeight = Math.min(Math.ceil(metrics.result.contentSize.height), 2800);
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: fullHeight,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 500));
  const shotFull = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/admin_dashboard_professional_full.png', Buffer.from(shotFull.result.data, 'base64'));
  console.log('Saved admin_dashboard_professional_full.png');

  ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}

