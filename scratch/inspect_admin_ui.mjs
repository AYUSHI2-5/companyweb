import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_inspect_admin_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9339',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9339/json/version');
  let version = await versionRes.json();
  let wsUrl = version.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

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
  let targetId = target.result.targetId;

  let session = await send('Target.attachToTarget', { targetId, flatten: true });
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

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Check Project Detail Page Hero Buttons
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 2000));

  let detailHeroShot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_detail_hero_buttons.png', Buffer.from(detailHeroShot.result.data, 'base64'));
  console.log('Saved scratch/inspect_detail_hero_buttons.png');

  // 2. Check Admin Page
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin.html' });
  await new Promise(r => setTimeout(r, 2000));

  let adminShot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_admin_page.png', Buffer.from(adminShot.result.data, 'base64'));
  console.log('Saved scratch/inspect_admin_page.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});
