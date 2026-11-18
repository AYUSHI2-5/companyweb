import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_modal_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9333',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9333/json/version');
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
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Step 1: Login
  console.log('Logging in...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/login.html' });
  await new Promise(r => setTimeout(r, 1200));

  await sendSession('Runtime.evaluate', {
    expression: `
      document.getElementById('username').value = 'admin';
      document.getElementById('password').value = 'Baadam@2026';
      document.getElementById('login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Step 2: Navigate to projects.html
  console.log('Navigating to projects.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/projects.html' });
  await new Promise(r => setTimeout(r, 1500));

  // Step 3: Open Edit Modal on Vishan Institute of Technology
  console.log('Opening edit modal...');
  await sendSession('Runtime.evaluate', {
    expression: `
      openProjectModal('vishan-institute-of-technology');
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Take screenshot of top of modal
  const ss1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/admin_modal_top_fixed.png`, Buffer.from(ss1.result.data, 'base64'));
  console.log('Saved admin_modal_top_fixed.png');

  // Step 4: Scroll down inside modal form body to see fields 8, 9 and footer
  await sendSession('Runtime.evaluate', {
    expression: `
      const body = document.querySelector('#project-modal .modal-form-body');
      body.scrollTop = 500;
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ss2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/admin_modal_scrolled_fixed.png`, Buffer.from(ss2.result.data, 'base64'));
  console.log('Saved admin_modal_scrolled_fixed.png');

  ws.close();
  chrome.kill();
  console.log('Done testing admin modal!');
  process.exit(0);
} catch (e) {
  console.error('Test error:', e);
  chrome.kill();
  process.exit(1);
}
