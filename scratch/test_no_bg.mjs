import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_nobg_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9256',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9256/json/version');
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

  const hideBgCSS = `
    .hero-ribbon-bg-img,
    .about-ribbon-bg-img,
    .services-ribbon-bg-img,
    .approach-ribbon-bg-img,
    .team-ribbon-bg-img,
    .page-ribbon-bg-img,
    .page-ribbon-bottom-img,
    .footer-ribbon-bg-img,
    .cta-banner-bg-img {
      display: none !important;
    }
  `;

  // Test about.html
  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 1500));
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const s = document.createElement('style');
      s.textContent = \`${hideBgCSS}\`;
      document.head.appendChild(s);
    })()`
  });
  await new Promise(r => setTimeout(r, 500));
  let shot = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\nobg_about.png', Buffer.from(shot.result.data, 'base64'));

  // Test index.html
  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1500));
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const s = document.createElement('style');
      s.textContent = \`${hideBgCSS}\`;
      document.head.appendChild(s);
      // Make all scroll-animated sections visible for full capture
      document.querySelectorAll('.scroll-animate').forEach(el => el.classList.add('is-visible'));
    })()`
  });
  await new Promise(r => setTimeout(r, 800));
  shot = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\nobg_index_full.png', Buffer.from(shot.result.data, 'base64'));

  console.log('Saved nobg screenshots');
  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
