import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_resp_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9254',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9254/json/version');
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
  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  const injectStyles = `
    const decor = document.querySelector('.page-bg-decor');
    decor.innerHTML = \`
      <img class="page-ribbon-bg-img" src="assets/about-ribbon-bg.jpg" alt="" style="
        position: absolute;
        top: 44%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        max-width: 1560px;
        height: 100%;
        max-height: 750px;
        object-fit: contain;
        object-position: center center;
        opacity: 0.92;
        pointer-events: none;
        z-index: 1;
        mix-blend-mode: multiply;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 48%, black 45%, transparent 85%);
        -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 48%, black 45%, transparent 85%);
      "/>
      <img class="page-ribbon-bottom-img" src="assets/team-ribbon-bottom.jpg" alt="" style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 1920px;
        height: clamp(70px, 9vw, 120px);
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

    const grid = document.querySelector('.services-grid');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = window.innerWidth <= 640 ? '1fr' : (window.innerWidth <= 991 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)');
    grid.style.maxWidth = window.innerWidth <= 640 ? '420px' : (window.innerWidth <= 991 ? '720px' : '1140px');
    grid.style.margin = '0 auto 3.5rem';
    grid.style.gap = window.innerWidth <= 640 ? '1.25rem' : '2rem';

    const main = document.querySelector('.page-main');
    main.style.padding = window.innerWidth <= 640 ? '3rem 0 6rem' : '5rem 0 8.5rem';
  `;

  const viewports = [
    { name: 'tablet_820', width: 820, height: 1180, mobile: false },
    { name: 'mobile_390', width: 390, height: 844, mobile: true }
  ];

  for (const vp of viewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });

    await sendSession('Runtime.evaluate', { expression: `(() => { ${injectStyles} })()` });
    await new Promise(r => setTimeout(r, 600));

    const shot = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\verified_about_${vp.name}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  console.log('Saved responsive test screenshots');
  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
