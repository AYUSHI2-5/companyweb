import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_fixed_cta_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9448',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9448/json/version');
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
  await sendSession('Runtime.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 2000));

  await sendSession('Runtime.evaluate', {
    expression: `document.querySelector('.cta-banner-section').scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await new Promise(r => setTimeout(r, 500));

  let evalData = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const card = document.querySelector('.cta-banner-card');
      const btn = document.querySelector('.cta-banner-card a');
      const arrow = document.querySelector('.cta-banner-card .btn-arrow-circle');
      const bStyle = btn ? window.getComputedStyle(btn) : null;
      const aStyle = arrow ? window.getComputedStyle(arrow) : null;
      const rect = card ? card.getBoundingClientRect() : null;
      return {
        cardFound: !!card,
        btnText: btn ? btn.innerText.trim() : null,
        btnBg: bStyle ? bStyle.backgroundColor : null,
        btnColor: bStyle ? bStyle.color : null,
        btnBorderRadius: bStyle ? bStyle.borderRadius : null,
        btnHeight: bStyle ? bStyle.height : null,
        arrowBg: aStyle ? aStyle.backgroundColor : null,
        arrowColor: aStyle ? aStyle.color : null,
        cardWidth: rect ? rect.width : null,
        cardHeight: rect ? rect.height : null
      };
    })())`
  });
  console.log('EVAL DATA:', evalData.result.result.value);

  let screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/fixed_cta_screenshot.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/fixed_cta_screenshot.png');

  // Also test mobile view (390px)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  await sendSession('Runtime.evaluate', {
    expression: `document.querySelector('.cta-banner-section').scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await new Promise(r => setTimeout(r, 500));

  let mobileScreenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/fixed_cta_mobile.png', Buffer.from(mobileScreenshot.result.data, 'base64'));
  console.log('Saved scratch/fixed_cta_mobile.png');

  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
