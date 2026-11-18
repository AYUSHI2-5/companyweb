import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_soft_dev_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9495',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9495/json/version');
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

  // Navigate to Software Development Page
  console.log('Navigating to http://localhost:8080/services/software-development/ ...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services/software-development/' });
  await new Promise(r => setTimeout(r, 2200));

  // Capture top hero and overview
  let shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path1 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\software_development_page_hero.png';
  fs.writeFileSync(path1, Buffer.from(shot1.result.data, 'base64'));
  console.log('Saved hero screenshot to:', path1);

  // Scroll down to capabilities and process
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo(0, 900);`
  });
  await new Promise(r => setTimeout(r, 1000));

  let shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path2 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\software_development_page_capabilities.png';
  fs.writeFileSync(path2, Buffer.from(shot2.result.data, 'base64'));
  console.log('Saved capabilities screenshot to:', path2);

  // Also verify clicking "Explore Capability" on services.html
  console.log('Navigating to http://localhost:8080/services.html ...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services.html' });
  await new Promise(r => setTimeout(r, 1800));

  await sendSession('Runtime.evaluate', {
    expression: `document.getElementById('software-dev').scrollIntoView();`
  });
  await new Promise(r => setTimeout(r, 600));

  let shot3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const path3 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\services_card_software_dev.png';
  fs.writeFileSync(path3, Buffer.from(shot3.result.data, 'base64'));
  console.log('Saved services card screenshot to:', path3);

  ws.close();
  chrome.kill();
  console.log('Done!');
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (e) {}
});
