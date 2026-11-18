import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_port_scroll_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9453',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9453/json/version');
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

  await sendSession('Page.navigate', { url: 'http://localhost:8080/portfolio.html?filter=enterprise' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to filter bar
  await sendSession('Runtime.evaluate', {
    expression: "document.getElementById('portfolio-filters').scrollIntoView({ behavior: 'instant', block: 'start' });"
  });
  await new Promise(r => setTimeout(r, 800));

  let shot = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_page_filter_bar_active.png';
  fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
  console.log(`Saved screenshot to: ${shotPath}`);

  await send('Browser.close');
  chrome.kill();
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
