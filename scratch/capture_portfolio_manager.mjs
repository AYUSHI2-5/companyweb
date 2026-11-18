import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_port_mgr_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9488',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9488/json/version');
  let version = await versionRes.json();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (event) => {
    let msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };
  function send(method, params = {}) {
    return new Promise(resolve => {
      let curId = id++;
      callbacks.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  let target = await send('Target.createTarget', { url: 'about:blank' });
  let session = await send('Target.attachToTarget', { targetId: target.result.targetId, flatten: true });
  let sessionId = session.result.sessionId;
  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      let curId = id++;
      callbacks.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');
  await sendSession('Network.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Login via API
  console.log('Authenticating via API...');
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  const loginData = await loginRes.json();

  await sendSession('Network.setCookie', {
    name: 'admin_session',
    value: loginData.token,
    domain: 'localhost',
    path: '/'
  });

  // 1. Capture Main Portfolio Projects Manager Dashboard
  console.log('Navigating to http://localhost:8080/admin/projects...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/projects' });
  await new Promise(r => setTimeout(r, 2200));

  let shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path1 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_manager_dashboard.png';
  fs.writeFileSync(path1, Buffer.from(shot1.result.data, 'base64'));
  console.log('Saved Portfolio Manager dashboard screenshot to:', path1);

  // 2. Open Project Preview Modal (View Action)
  console.log('Opening Preview Modal for kp-e-services...');
  await sendSession('Runtime.evaluate', {
    expression: `openProjectPreview('kp-e-services')`
  });
  await new Promise(r => setTimeout(r, 1200));

  let shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path2 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_preview_modal.png';
  fs.writeFileSync(path2, Buffer.from(shot2.result.data, 'base64'));
  console.log('Saved Project Preview modal screenshot to:', path2);

  // 3. Close Preview and test Filter by Homepage (Featured)
  console.log('Closing preview and filtering by Featured on Homepage...');
  await sendSession('Runtime.evaluate', {
    expression: `
      closePreviewModal();
      document.getElementById('filter-homepage').value = 'yes';
      applyFilters();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  let shot3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path3 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_manager_filtered_featured.png';
  fs.writeFileSync(path3, Buffer.from(shot3.result.data, 'base64'));
  console.log('Saved filtered featured projects screenshot to:', path3);

  ws.close();
  chrome.kill();
  console.log('Done capturing all verification screenshots!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  try { chrome.kill(); } catch (e) {}
});
