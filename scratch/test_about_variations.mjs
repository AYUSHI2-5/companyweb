import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_var_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9251',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9251/json/version');
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
    height: 960,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  // --- Variation A: Refined single-section About Us with dual ribbon architecture ---
  // (Top framing ribbon about-ribbon-bg.jpg + Bottom flowing ribbon team-ribbon-bottom.jpg)
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      // 1. Configure top framing ribbon
      const decor = document.querySelector('.page-bg-decor');
      decor.innerHTML = \`
        <img class="page-ribbon-bg-img" src="assets/about-ribbon-bg.jpg" alt="" style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1560px;
          height: 100%;
          max-height: 720px;
          object-fit: contain;
          object-position: center top;
          opacity: 0.92;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, black 45%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, black 45%, transparent 85%);
        "/>
        <img class="page-ribbon-bottom-img" src="assets/team-ribbon-bottom.jpg" alt="" style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1920px;
          height: clamp(90px, 11vw, 130px);
          object-fit: cover;
          object-position: center bottom;
          opacity: 0.95;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
          mask-image: linear-gradient(to top, black 65%, transparent 100%);
          -webkit-mask-image: linear-gradient(to top, black 65%, transparent 100%);
        "/>
      \`;

      const main = document.querySelector('.page-main');
      main.style.padding = '4.5rem 0 7rem';
      main.style.minHeight = 'calc(100vh - 84px)';
      main.style.display = 'flex';
      main.style.flexDirection = 'column';
      main.style.justifyContent = 'center';

      const container = document.querySelector('.page-container');
      container.style.position = 'relative';
      container.style.zIndex = '3';
    })()`
  });

  await new Promise(r => setTimeout(r, 600));
  let shot = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\var_A_single_section_dual_ribbon.png', Buffer.from(shot.result.data, 'base64'));

  // --- Variation B: Pure framing with about-ribbon-bg.jpg perfectly scaled to frame the cards ---
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const decor = document.querySelector('.page-bg-decor');
      decor.innerHTML = \`
        <img class="page-ribbon-bg-img" src="assets/about-ribbon-bg.jpg" alt="" style="
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 1480px;
          height: auto;
          aspect-ratio: 1376 / 768;
          max-height: 85vh;
          object-fit: contain;
          object-position: center center;
          opacity: 0.92;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
        "/>
      \`;
      const main = document.querySelector('.page-main');
      main.style.padding = '5rem 0 6rem';
      main.style.minHeight = 'calc(100vh - 84px)';
    })()`
  });

  await new Promise(r => setTimeout(r, 600));
  shot = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\var_B_pure_framing.png', Buffer.from(shot.result.data, 'base64'));

  // --- Variation C: approach-ribbon-bg.jpg framing from sides & corners ---
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const decor = document.querySelector('.page-bg-decor');
      decor.innerHTML = \`
        <img class="page-ribbon-bg-img" src="assets/approach-ribbon-bg.jpg" alt="" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 1540px;
          height: 100%;
          max-height: 720px;
          object-fit: contain;
          object-position: center center;
          opacity: 0.88;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, black 50%, black 85%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, black 50%, black 85%, transparent 100%);
        "/>
      \`;
    })()`
  });

  await new Promise(r => setTimeout(r, 600));
  shot = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\var_C_approach_radial_hollow.png', Buffer.from(shot.result.data, 'base64'));

  console.log('Saved all variation screenshots');
  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
