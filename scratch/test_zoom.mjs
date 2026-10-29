import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_zoom_test';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9230/json/version');
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

  const zooms = [
    { name: 'zoom_100', width: 1366, height: 768 },
    { name: 'zoom_75', width: 1821, height: 1024 },
    { name: 'zoom_50', width: 2732, height: 1536 }
  ];

  for (const z of zooms) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: z.width,
      height: z.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(r => setTimeout(r, 2000));

    const metricsRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const ribbon = document.querySelector('.hero-ribbon-bg-img');
        const container = document.querySelector('.hero-container');
        const rRect = ribbon ? ribbon.getBoundingClientRect() : null;
        const cRect = container ? container.getBoundingClientRect() : null;

        return JSON.stringify({
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          ribbonWidth: rRect ? Math.round(rRect.width) : 0,
          ribbonHeight: rRect ? Math.round(rRect.height) : 0,
          containerWidth: cRect ? Math.round(cRect.width) : 0
        });
      })()`,
      returnByValue: true
    });

    console.log(`[${z.name}]`, metricsRes.result.result.value);

    const shot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: z.width, height: z.height, scale: 1 }
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\hero_${z.name}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  ws.close();
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
  process.exit(0);
}
