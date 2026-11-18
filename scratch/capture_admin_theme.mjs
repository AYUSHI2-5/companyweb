import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_admin_shot_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9455',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9455/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1400,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Login Page
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/login' });
  await new Promise(r => setTimeout(r, 1200));
  let shotLogin = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_login_current.png', Buffer.from(shotLogin.result.data, 'base64'));

  // Perform login via evaluate
  await sendSession('Runtime.evaluate', {
    expression: `(async () => {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
      });
      return res.status;
    })()`,
    awaitPromise: true
  });

  // 2. Dashboard Page
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/dashboard.html' });
  await new Promise(r => setTimeout(r, 1500));
  let shotDash = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_dashboard_current.png', Buffer.from(shotDash.result.data, 'base64'));

  // 3. Homepage Manager Page
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/index.html' });
  await new Promise(r => setTimeout(r, 1500));
  let shotHp = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_homepage_current.png', Buffer.from(shotHp.result.data, 'base64'));

  // 4. Hero Editor Page
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/hero.html' });
  await new Promise(r => setTimeout(r, 1500));
  let shotHero = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_hero_current.png', Buffer.from(shotHero.result.data, 'base64'));

  await send('Browser.close');
  chrome.kill();
  console.log('Saved admin screenshots!');
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
