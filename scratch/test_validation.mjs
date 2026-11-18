import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_val_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9480',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9480/json/version');
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

  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/projects' });
  await new Promise(r => setTimeout(r, 2000));

  // Open modal for 'kp-e-services'
  await sendSession('Runtime.evaluate', {
    expression: `openProjectModal('kp-e-services')`
  });
  await new Promise(r => setTimeout(r, 800));

  // Clear title and duration to trigger validation
  await sendSession('Runtime.evaluate', {
    expression: `
      document.getElementById('field-title').value = '';
      document.getElementById('field-duration').value = '';
      document.getElementById('project-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `
  });
  await new Promise(r => setTimeout(r, 600));

  let shot = await sendSession('Page.captureScreenshot', { format: 'png' });
  const pathVal = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_project_validation_error.png';
  fs.writeFileSync(pathVal, Buffer.from(shot.result.data, 'base64'));
  console.log('Saved validation screenshot to:', pathVal);

  ws.close();
  chrome.kill();
  console.log('Done!');
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (e) {}
});
