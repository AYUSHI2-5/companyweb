import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_services_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9470',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9470/json/version');
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

  // Login via API to set cookie
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

  // 1. Capture /admin/services (Services List Management)
  console.log('Navigating to http://localhost:8080/admin/services...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/services' });
  await new Promise(r => setTimeout(r, 2200));

  let shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path1 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_services_page_list.png';
  fs.writeFileSync(path1, Buffer.from(shot1.result.data, 'base64'));
  console.log('Saved admin services list screenshot to:', path1);

  // 2. Open Edit Service Modal for Service 01 (Website Development)
  console.log('Opening Edit Service Modal...');
  await sendSession('Runtime.evaluate', {
    expression: `openEditServiceModal('srv-web-dev')`
  });
  await new Promise(r => setTimeout(r, 1200));

  let shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path2 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_service_edit_modal.png';
  fs.writeFileSync(path2, Buffer.from(shot2.result.data, 'base64'));
  console.log('Saved edit service modal screenshot to:', path2);

  // Close modal and switch to Header Settings tab
  console.log('Switching to Header Settings tab...');
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      closeServiceModal();
      document.querySelectorAll('.tab-btn')[1].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  let shot3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path3 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_services_header_settings.png';
  fs.writeFileSync(path3, Buffer.from(shot3.result.data, 'base64'));
  console.log('Saved header settings screenshot to:', path3);

  // 3. Switch to Card Grid Settings tab
  console.log('Switching to Grid Settings tab...');
  await sendSession('Runtime.evaluate', {
    expression: `document.querySelectorAll('.tab-btn')[2].click()`
  });
  await new Promise(r => setTimeout(r, 1200));

  let shot4 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path4 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_services_grid_settings.png';
  fs.writeFileSync(path4, Buffer.from(shot4.result.data, 'base64'));
  console.log('Saved grid settings screenshot to:', path4);

  // 4. Capture Public Live Services Page (services.html)
  console.log('Navigating to live http://localhost:8080/services.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services.html' });
  await new Promise(r => setTimeout(r, 2200));

  let shot5 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path5 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\services_page_live_intact.png';
  fs.writeFileSync(path5, Buffer.from(shot5.result.data, 'base64'));
  console.log('Saved live services page screenshot to:', path5);

  await send('Browser.close');
  chrome.kill();
  console.log('All Services CMS screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
