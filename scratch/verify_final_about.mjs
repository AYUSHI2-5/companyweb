import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_final_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9255',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9255/json/version');
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

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900, dsf: 1, mobile: false },
    { name: 'tablet_820', width: 820, height: 1180, dsf: 2, mobile: false },
    { name: 'mobile_390', width: 390, height: 844, dsf: 2, mobile: true }
  ];

  for (const vp of viewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      mobile: vp.mobile
    });

    await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
    await new Promise(r => setTimeout(r, 1800));

    // Measure bounding boxes of elements
    const metricsRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const ribbonBg = document.querySelector('.page-ribbon-bg-img');
        const ribbonBottom = document.querySelector('.page-ribbon-bottom-img');
        const header = document.querySelector('.page-header');
        const grid = document.querySelector('.about-values-grid');
        const cards = Array.from(document.querySelectorAll('.service-card-item'));

        return JSON.stringify({
          ribbonBg: ribbonBg ? ribbonBg.getBoundingClientRect() : null,
          ribbonBottom: ribbonBottom ? ribbonBottom.getBoundingClientRect() : null,
          header: header ? header.getBoundingClientRect() : null,
          grid: grid ? grid.getBoundingClientRect() : null,
          cardCount: cards.length,
          cardWidth: cards.length > 0 ? cards[0].getBoundingClientRect().width : 0
        });
      })()`,
      returnByValue: true
    });

    console.log('[' + vp.name + '] metrics:', metricsRes.result.value);

    const shot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    fs.writeFileSync(
      'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\final_about_' + vp.name + '.png',
      Buffer.from(shot.result.data, 'base64')
    );
  }

  console.log('Finished capturing final verification screenshots.');
  ws.close();
} catch (err) {
  console.error('Error in verification:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
