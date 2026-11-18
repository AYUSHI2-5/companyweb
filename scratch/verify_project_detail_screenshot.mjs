import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_proj_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9318',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9318/json/version');
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
  await sendSession('DOM.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Navigate to LPG Booking project page
  console.log('Navigating to http://localhost:8080/projects/lpg-booking/index.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/lpg-booking/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  const snapRes = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\lpg_booking_no_manage_admin.png', Buffer.from(snapRes.result.data, 'base64'));
  console.log('Saved lpg_booking_no_manage_admin.png');

  // Also navigate to KP E-Services project page
  console.log('Navigating to http://localhost:8080/projects/kp-e-services/index.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/kp-e-services/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  const snapRes2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\kpeservices_no_manage_admin.png', Buffer.from(snapRes2.result.data, 'base64'));
  console.log('Saved kpeservices_no_manage_admin.png');

  ws.close();
} catch (e) {
  console.error('CDP error:', e);
} finally {
  chrome.kill();
}
