import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_mobile_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9335',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9335/json/version');
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
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  const fileUrl = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await sendSession('Page.navigate', { url: fileUrl });

  await new Promise(r => setTimeout(r, 2500));

  let evalRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const card = document.querySelector('.cta-banner-card');
      const rect = card ? card.getBoundingClientRect() : null;
      
      return JSON.stringify({
        docWidth,
        winWidth,
        hasHorizontalOverflow: docWidth > winWidth,
        cardWidth: rect ? rect.width : null,
        cardHeight: rect ? rect.height : null
      });
    })()`
  });

  console.log('MOBILE EVAL:', evalRes.result.result.value);

  // Take screenshot
  await sendSession('Runtime.evaluate', {
    expression: `document.querySelector('.cta-banner-card').scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await new Promise(r => setTimeout(r, 500));

  let screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/cta_mobile.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/cta_mobile.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});

