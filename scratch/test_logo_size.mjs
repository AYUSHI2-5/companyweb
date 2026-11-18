import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_logo_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9340',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9340/json/version');
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

  // 1. Check Detail page navbar
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/ashray-labs/' });
  await new Promise(r => setTimeout(r, 1200));

  const ssDetail = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
  });
  fs.writeFileSync(`${artifactDir}/verified_navbar_logo_detail.png`, Buffer.from(ssDetail.result.data, 'base64'));

  // 2. Check Homepage navbar
  await sendSession('Page.navigate', { url: 'http://localhost:8080/index.html' });
  await new Promise(r => setTimeout(r, 1200));

  const ssHome = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 180, scale: 1 }
  });
  fs.writeFileSync(`${artifactDir}/verified_navbar_logo_home.png`, Buffer.from(ssHome.result.data, 'base64'));

  // 3. Check mobile navbar
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await sendSession('Page.navigate', { url: 'http://localhost:8080/index.html' });
  await new Promise(r => setTimeout(r, 1000));

  const ssMobile = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 390, height: 160, scale: 1 }
  });
  fs.writeFileSync(`${artifactDir}/verified_navbar_logo_mobile.png`, Buffer.from(ssMobile.result.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Logo screenshots captured successfully!');
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}
