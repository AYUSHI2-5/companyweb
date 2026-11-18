import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_detail_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9322',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9322/json/version');
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
  await sendSession('Network.enable');
  await sendSession('Runtime.enable');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Capture KP E-Services top
  console.log('Navigating to http://127.0.0.1:8080/projects/kp-e-services/...');
  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 2500));

  const shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/project_detail_kpeservices.png', Buffer.from(shot1.result.data, 'base64'));
  console.log('Saved project_detail_kpeservices.png');

  // Full page screenshot of KP E-Services
  const layoutMetrics = await sendSession('Page.getLayoutMetrics');
  const fullHeight = Math.min(Math.ceil(layoutMetrics.result.contentSize.height), 3600);
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: fullHeight,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 600));
  const shotFull = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/project_detail_kpeservices_full.png', Buffer.from(shotFull.result.data, 'base64'));
  console.log('Saved project_detail_kpeservices_full.png');

  // Reset viewport and test Lightbox
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendSession('Runtime.evaluate', { expression: 'openLightbox(1)' });
  await new Promise(r => setTimeout(r, 800));
  const shotLightbox = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/project_detail_lightbox.png', Buffer.from(shotLightbox.result.data, 'base64'));
  console.log('Saved project_detail_lightbox.png');

  // 2. Admin Homepage Management (verifying Primary Navigation Links removed)
  // Set auth cookie directly
  await sendSession('Network.setCookie', {
    name: 'admin_session',
    value: 'adm_session_valid_active',
    domain: 'localhost',
    path: '/'
  });

  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/admin/homepage/index.html' });
  await new Promise(r => setTimeout(r, 2000));
  const shotAdmin = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/admin_homepage_no_nav_links.png', Buffer.from(shotAdmin.result.data, 'base64'));
  console.log('Saved admin_homepage_no_nav_links.png');

  ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
