import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_ribbon_all';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9232',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));
x`  `
try {
  const versionRes = await fetch('http://127.0.0.1:9232/json/version');
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

  const testCSS = `
    @media (min-width: 992px) {
      .hero-section {
        height: calc(100vh - 71px - 62px) !important;
        max-height: min(760px, calc(100vh - 71px - 62px)) !important;
      }
    }

    /* Interactive Proportional Background Ribbons */
    .hero-ribbon-bg-img {
      position: absolute !important;
      bottom: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) var(--ribbon-parallax, translate(0, 0)) !important;
      width: 100% !important;
      max-width: min(1560px, 100vw) !important;
      height: 100% !important;
      max-height: clamp(380px, 58vh, 560px) !important;
      object-fit: contain !important;
      object-position: center bottom !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .about-ribbon-bg-img {
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) var(--ribbon-parallax, translate(0, 0)) !important;
      width: 100% !important;
      max-width: min(1600px, 100vw) !important;
      height: 100% !important;
      max-height: clamp(420px, 70vh, 640px) !important;
      object-fit: contain !important;
      object-position: center center !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .services-ribbon-bg-img {
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) var(--ribbon-parallax, translate(0, 0)) !important;
      width: 100% !important;
      max-width: min(1600px, 100vw) !important;
      height: 100% !important;
      max-height: clamp(440px, 70vh, 680px) !important;
      object-fit: contain !important;
      object-position: center center !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .approach-ribbon-bg-img {
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) var(--ribbon-parallax, translate(0, 0)) !important;
      width: 100% !important;
      max-width: min(1600px, 100vw) !important;
      height: 100% !important;
      max-height: clamp(420px, 70vh, 640px) !important;
      object-fit: contain !important;
      object-position: center center !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .team-ribbon-bg-img {
      position: absolute !important;
      bottom: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) var(--ribbon-parallax, translate(0, 0)) !important;
      width: 100% !important;
      max-width: min(1560px, 100vw) !important;
      height: auto !important;
      max-height: 280px !important;
      object-fit: contain !important;
      object-position: center bottom !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .footer-ribbon-bg-img {
      position: absolute !important;
      bottom: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) var(--ribbon-parallax, translate(0, 0)) !important;
      width: 100% !important;
      max-width: min(1600px, 100vw) !important;
      height: 100% !important;
      max-height: clamp(340px, 50vh, 480px) !important;
      object-fit: contain !important;
      object-position: center bottom !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
  `;

  const zooms = [
    { name: '100', width: 1366, height: 768 },
    { name: '75', width: 1821, height: 1024 },
    { name: '50', width: 2732, height: 1536 }
  ];

  for (const z of zooms) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: z.width,
      height: z.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(r => setTimeout(r, 1200));

    // Inject style & test script
    await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const style = document.createElement('style');
        style.textContent = \`${testCSS}\`;
        document.head.appendChild(style);

        // Make all sections visible
        document.querySelectorAll('.scroll-animate').forEach(el => el.classList.add('is-visible'));
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    // Screenshot initial fold (hero + marquee)
    const foldShot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: z.width, height: z.height, scale: 1 }
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\all_ribbons_${z.name}_fold.png`, Buffer.from(foldShot.result.data, 'base64'));

    // Screenshot full page
    const fullShot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: z.width, height: Math.min(4500, z.height * 2.5), scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\all_ribbons_${z.name}_full.png`, Buffer.from(fullShot.result.data, 'base64'));
  }

  ws.close();
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
  process.exit(0);
}
