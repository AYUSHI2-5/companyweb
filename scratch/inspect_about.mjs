import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_inspect_about';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9226/json/version');
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
  await sendSession('Network.enable');
  await sendSession('Network.setCacheDisabled', { cacheDisabled: true });

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll about-section into view so intersection observer triggers
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('about-section');
      sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      sec.classList.add('is-visible');
    })()`
  });

  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot of about section
  const secRectRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const r = document.getElementById('about-section').getBoundingClientRect();
      return JSON.stringify({
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height)
      });
    })()`,
    returnByValue: true
  });
  const secRect = JSON.parse(secRectRes.result.result.value);

  const shot = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: Math.max(0, secRect.y),
      width: 1366,
      height: Math.min(secRect.height, 768),
      scale: 1
    }
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\current_about_section.png', Buffer.from(shot.result.data, 'base64'));

  // Also test tablet & mobile viewports to ensure responsiveness
  const testViewports = [
    { name: 'tablet_768', width: 768, height: 1024, mobile: false },
    { name: 'mobile_375', width: 375, height: 812, mobile: true }
  ];

  for (const vp of testViewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    await new Promise(r => setTimeout(r, 500));
    await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.getElementById('about-section');
        sec.scrollIntoView({ behavior: 'instant', block: 'center' });
        sec.classList.add('is-visible');
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const vpRectRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const r = document.getElementById('about-section').getBoundingClientRect();
        const card = document.querySelector('.about-image-card');
        const img = document.querySelector('.about-office-img');
        const cr = card.getBoundingClientRect();
        const ir = img.getBoundingClientRect();
        return JSON.stringify({
          sec: { y: Math.round(r.y), h: Math.round(r.height) },
          card: { w: Math.round(cr.width), h: Math.round(cr.height) },
          img: { w: Math.round(ir.width), h: Math.round(ir.height) },
          heightDiff: Math.round(cr.height - ir.height),
          overflow: document.documentElement.scrollWidth > window.innerWidth
        });
      })()`,
      returnByValue: true
    });
    console.log(`[${vp.name}]`, vpRectRes.result.result.value);

    const vpRectData = JSON.parse(vpRectRes.result.result.value);
    const vpShot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: Math.max(0, vpRectData.sec.y),
        width: vp.width,
        height: Math.min(vpRectData.sec.h, vp.height),
        scale: 1
      }
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\about_${vp.name}.png`, Buffer.from(vpShot.result.data, 'base64'));
  }

  ws.close();
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
  process.exit(0);
}
