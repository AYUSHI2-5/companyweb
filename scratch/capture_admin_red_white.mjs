import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_rw_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9460',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9460/json/version');
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

  // 1. Capture clean Red & White Login Page
  console.log('Navigating to login page...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/login' });
  await new Promise(r => setTimeout(r, 1500));

  let shotLogin = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathLogin = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_login_red_white.png';
  fs.writeFileSync(shotPathLogin, Buffer.from(shotLogin.result.data, 'base64'));
  console.log('Saved login screenshot');

  // 2. Perform API login directly to get a real session token
  console.log('Authenticating via API...');
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  const loginData = await loginRes.json();
  console.log('API login response:', loginData);

  // Set the admin_session cookie in browser
  await sendSession('Network.setCookie', {
    name: 'admin_session',
    value: loginData.token,
    domain: 'localhost',
    path: '/'
  });

  // 3. Navigate to Dashboard
  console.log('Navigating to Dashboard...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/dashboard.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotDash = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathDash = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_dashboard_red_white.png';
  fs.writeFileSync(shotPathDash, Buffer.from(shotDash.result.data, 'base64'));
  console.log('Saved dashboard screenshot');

  // 4. Navigate to Homepage Management
  console.log('Navigating to Homepage Manager...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotHp = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathHp = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_homepage_red_white.png';
  fs.writeFileSync(shotPathHp, Buffer.from(shotHp.result.data, 'base64'));
  console.log('Saved homepage manager screenshot');

  // 5. Navigate to Hero Editor
  console.log('Navigating to Hero Editor...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/hero.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotHero = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathHero = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_hero_red_white.png';
  fs.writeFileSync(shotPathHero, Buffer.from(shotHero.result.data, 'base64'));
  console.log('Saved hero editor screenshot');

  // 6. Navigate to Services Editor
  console.log('Navigating to Services Editor...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/services.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotServices = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathServices = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_services_red_white.png';
  fs.writeFileSync(shotPathServices, Buffer.from(shotServices.result.data, 'base64'));
  console.log('Saved services editor screenshot');

  // 7. Navigate to Header Editor
  console.log('Navigating to Header Editor...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/header.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotHeader = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathHeader = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_header_red_white.png';
  fs.writeFileSync(shotPathHeader, Buffer.from(shotHeader.result.data, 'base64'));
  console.log('Saved header editor screenshot');

  // 8. Navigate to Featured Work Editor
  console.log('Navigating to Featured Work Editor...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/featured-work.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotWork = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathWork = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_featured_work_red_white.png';
  fs.writeFileSync(shotPathWork, Buffer.from(shotWork.result.data, 'base64'));
  console.log('Saved featured work editor screenshot');

  // 9. Navigate to Media Library
  console.log('Navigating to Media Library...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/media.html' });
  await new Promise(r => setTimeout(r, 2000));

  let shotMedia = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPathMedia = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_media_red_white.png';
  fs.writeFileSync(shotPathMedia, Buffer.from(shotMedia.result.data, 'base64'));
  console.log('Saved media library screenshot');

  await send('Browser.close');
  chrome.kill();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
