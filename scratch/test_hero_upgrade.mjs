import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_hero_test';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9229',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9229/json/version');
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

  const viewports = [
    { name: 'desktop_1920', width: 1920, height: 1080 },
    { name: 'laptop_1366', width: 1366, height: 768 }
  ];

  for (const vp of viewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(r => setTimeout(r, 2000));

    const metricsRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.getElementById('hero-section');
        const marquee = document.querySelector('.tech-marquee-wrapper');
        const visual = document.querySelector('.hero-visual');
        const card = document.querySelector('.hero-image-card');
        const img = document.querySelector('.hero-building-img');

        const hr = hero.getBoundingClientRect();
        const mr = marquee.getBoundingClientRect();
        const vr = visual.getBoundingClientRect();
        const cr = card.getBoundingClientRect();
        const ir = img.getBoundingClientRect();

        return JSON.stringify({
          heroHeight: Math.round(hr.height),
          marqueeBottom: Math.round(mr.bottom),
          fitsAboveFold: mr.bottom <= window.innerHeight,
          visualWidth: Math.round(vr.width),
          cardWidth: Math.round(cr.width),
          imgWidth: Math.round(ir.width),
          imgHeight: Math.round(ir.height)
        });
      })()`,
      returnByValue: true
    });

    console.log(`[${vp.name}]`, metricsRes.result.result.value);

    // Initial fold screenshot
    const shot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height, scale: 1 }
    });

    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\hero_${vp.name}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  ws.close();
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
  process.exit(0);
}
