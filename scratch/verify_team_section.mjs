import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_team_verify_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9245',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9245/json/version');
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
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.name === 'mobile'
    });

    await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(r => setTimeout(r, 1500));

    // Force is-visible so cards are in their final positions
    await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.team-section');
        if (sec) sec.classList.add('is-visible');
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const metricsRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.team-section');
        const box = sec.getBoundingClientRect();
        const pag = document.querySelector('.team-pagination')?.getBoundingClientRect();
        const ribEl = document.querySelector('.team-ribbon-bg-img');
        const rib = ribEl?.getBoundingClientRect();
        const arc = document.querySelector('.team-arc-left');
        return JSON.stringify({
          pageY: Math.round(box.top + window.scrollY),
          height: Math.round(box.height),
          pagBottom: pag ? Math.round(pag.bottom + window.scrollY) : null,
          ribTop: rib ? Math.round(rib.top + window.scrollY) : null,
          ribHeight: rib ? Math.round(rib.height) : null,
          separation: (rib && pag) ? Math.round((rib.top + window.scrollY) - (pag.bottom + window.scrollY)) : null,
          arcVisible: arc ? window.getComputedStyle(arc).display !== 'none' : false,
          imgSrc: ribEl?.getAttribute('src')
        });
      })()`,
      returnByValue: true
    });

    if (!metricsRes.result?.result?.value) {
      console.log(`[${vp.name}] eval error:`, JSON.stringify(metricsRes, null, 2));
      continue;
    }
    const metrics = JSON.parse(metricsRes.result.result.value);
    console.log(`[${vp.name}] metrics:`, metrics);

    const shot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: metrics.pageY,
        width: vp.width,
        height: metrics.height,
        scale: 1
      },
      captureBeyondViewport: true
    });

    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\verified_team_${vp.name}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  console.log('All verification screenshots saved successfully.');
  ws.close();
} catch (err) {
  console.error('ERROR in verify script:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
