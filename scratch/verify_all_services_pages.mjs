import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_all_serv_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9499',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9499/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Capture Software Development Page
  console.log('Capturing Software Development Page...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services/software-development/' });
  await new Promise(r => setTimeout(r, 2000));

  let shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path1 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\verify_software_dev_match.png';
  fs.writeFileSync(path1, Buffer.from(shot1.result.data, 'base64'));
  console.log('Saved software dev screenshot to:', path1);

  // 2. Capture Application Development Page for comparison
  console.log('Capturing Application Development Page...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services/application-development/' });
  await new Promise(r => setTimeout(r, 2000));

  let shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path2 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\verify_app_dev_reference.png';
  fs.writeFileSync(path2, Buffer.from(shot2.result.data, 'base64'));
  console.log('Saved app dev reference screenshot to:', path2);

  ws.close();
  chrome.kill();
  console.log('Done verification!');
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (e) {}
});
