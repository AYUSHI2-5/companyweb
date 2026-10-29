import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_about_explore_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9248',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9248/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Option A: Use about-ribbon-bg.jpg scaled to frame the entire page-main
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const rib = document.querySelector('.page-ribbon-bg-img');
      rib.src = 'assets/about-ribbon-bg.jpg';
      rib.style.position = 'absolute';
      rib.style.top = '0';
      rib.style.bottom = 'auto';
      rib.style.left = '50%';
      rib.style.transform = 'translateX(-50%) var(--ribbon-parallax, translate3d(0,0,0))';
      rib.style.width = '100%';
      rib.style.maxWidth = 'min(1600px, 100vw)';
      rib.style.height = '100%';
      rib.style.maxHeight = '100%';
      rib.style.objectFit = 'contain';
      rib.style.objectPosition = 'center top';
      rib.style.opacity = '0.9';
      rib.style.mixBlendMode = 'multiply';
      rib.style.maskImage = 'none';
      rib.style.webkitMaskImage = 'none';

      // Also give page-main generous padding
      const main = document.querySelector('.page-main');
      main.style.position = 'relative';
      main.style.overflow = 'hidden';
      main.style.padding = '4.5rem 0 6.5rem';
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const shotA = await sendSession('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\about_optionA_frame.png', Buffer.from(shotA.result.data, 'base64'));

  // Option B: Both Top Frame (about-ribbon-bg.jpg) AND Bottom Wave (hero-ribbon-flow.jpg / team-ribbon-bottom.jpg)
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const decor = document.querySelector('.page-bg-decor');
      // add a bottom ribbon
      let btmRib = document.querySelector('.page-ribbon-bottom-img');
      if (!btmRib) {
        btmRib = document.createElement('img');
        btmRib.className = 'page-ribbon-bottom-img';
        decor.appendChild(btmRib);
      }
      btmRib.src = 'assets/team-ribbon-bottom.jpg';
      btmRib.style.position = 'absolute';
      btmRib.style.bottom = '0';
      btmRib.style.left = '50%';
      btmRib.style.transform = 'translateX(-50%) var(--ribbon-parallax, translate3d(0,0,0))';
      btmRib.style.width = '100%';
      btmRib.style.maxWidth = 'min(1560px, 100vw)';
      btmRib.style.height = 'auto';
      btmRib.style.maxHeight = '120px';
      btmRib.style.objectFit = 'contain';
      btmRib.style.objectPosition = 'center bottom';
      btmRib.style.opacity = '0.9';
      btmRib.style.mixBlendMode = 'multiply';
      btmRib.style.maskImage = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 30%, black 100%)';
      btmRib.style.webkitMaskImage = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 30%, black 100%)';
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const shotB = await sendSession('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\about_optionB_dual.png', Buffer.from(shotB.result.data, 'base64'));

  console.log('Saved explore shots');
  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
