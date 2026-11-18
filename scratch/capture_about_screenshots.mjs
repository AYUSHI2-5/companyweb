import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_about_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9311',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9311/json/version');
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

  // Set auth cookie
  await sendSession('Network.setCookie', {
    name: 'admin_session',
    value: 'adm_session_valid_active',
    domain: 'localhost',
    path: '/'
  });

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Navigate to admin about
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/about.html' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Screenshot Hero Tab
  const ss1 = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const path1 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_about_hero_tab.png';
  fs.writeFileSync(path1, Buffer.from(ss1.result.data, 'base64'));
  console.log('Saved hero tab screenshot');

  // 2. Switch to Team Tab
  await sendSession('Runtime.evaluate', { expression: "switchAboutTab('team')" });
  await new Promise(r => setTimeout(r, 1000));
  const ss2 = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const path2 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_about_team_tab.png';
  fs.writeFileSync(path2, Buffer.from(ss2.result.data, 'base64'));
  console.log('Saved team tab screenshot');

  // 3. Switch to Sections Hub Tab
  await sendSession('Runtime.evaluate', { expression: "switchAboutTab('hub')" });
  await new Promise(r => setTimeout(r, 1000));
  const ss3 = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const path3 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_about_hub_tab.png';
  fs.writeFileSync(path3, Buffer.from(ss3.result.data, 'base64'));
  console.log('Saved hub tab screenshot');

} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}
