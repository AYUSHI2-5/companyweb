import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_cta_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9334',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9334/json/version');
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

  // Create target page
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

  const fileUrl = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await sendSession('Page.navigate', { url: fileUrl });

  await new Promise(r => setTimeout(r, 2500));

  let evalRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.cta-banner-card');
      const btn = document.querySelector('.cta-banner-card .btn-primary-pill');
      const arrow = document.querySelector('.cta-banner-card .btn-arrow-circle');
      const img = document.querySelector('.cta-banner-card .cta-collab-img');
      const bStyle = btn ? window.getComputedStyle(btn) : null;
      const aStyle = arrow ? window.getComputedStyle(arrow) : null;
      const rect = card ? card.getBoundingClientRect() : null;
      
      return JSON.stringify({
        cardFound: !!card,
        btnFound: !!btn,
        btnBg: bStyle ? bStyle.backgroundColor : null,
        btnColor: bStyle ? bStyle.color : null,
        btnDisplay: bStyle ? bStyle.display : null,
        arrowFound: !!arrow,
        arrowBg: aStyle ? aStyle.backgroundColor : null,
        arrowColor: aStyle ? aStyle.color : null,
        imgFound: !!img,
        imgSrc: img ? img.src : null,
        imgNaturalWidth: img ? img.naturalWidth : null,
        cardWidth: rect ? rect.width : null,
        cardHeight: rect ? rect.height : null
      });
    })()`
  });

  console.log('EVAL VALUE:', evalRes.result.result.value);

  // Take full screenshot or viewport
  await sendSession('Runtime.evaluate', {
    expression: `document.querySelector('.cta-banner-card').scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await new Promise(r => setTimeout(r, 500));

  let screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/cta_viewport.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/cta_viewport.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});
