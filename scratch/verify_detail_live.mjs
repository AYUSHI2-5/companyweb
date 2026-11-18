import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_live_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9337',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9337/json/version');
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

  // 1. Ashray Labs
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/ashray-labs/' });
  await new Promise(r => setTimeout(r, 1500));

  const ssAshray = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_ashray_detail_viewport.png`, Buffer.from(ssAshray.result.data, 'base64'));

  const ssAshrayFull = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(`${artifactDir}/verified_ashray_detail_full.png`, Buffer.from(ssAshrayFull.result.data, 'base64'));

  // 2. KP E-Services
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 1500));

  const ssKp = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_kp_detail_viewport.png`, Buffer.from(ssKp.result.data, 'base64'));

  // 3. Vishan Institute
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/vishan-institute-of-technology/' });
  await new Promise(r => setTimeout(r, 1500));

  const ssVishan = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_vishan_detail_viewport.png`, Buffer.from(ssVishan.result.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Successfully captured all detail page verification screenshots!');
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}

