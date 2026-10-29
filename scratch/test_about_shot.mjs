import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_test_about_shot';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9228',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9228/json/version');
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
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Trigger is-visible and wait for transition to finish
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('about-section');
      sec.classList.add('is-visible');
      // remove transition delay/duration so it is instantly 100% visible
      const t = document.querySelector('.about-text-col');
      const v = document.querySelector('.about-visual-col');
      if (t) { t.style.opacity = '1'; t.style.transform = 'none'; t.style.transition = 'none'; }
      if (v) { v.style.opacity = '1'; v.style.transform = 'none'; v.style.transition = 'none'; }
    })()`
  });

  await new Promise(r => setTimeout(r, 500));

  // Get exact document offset of about-section
  const docRectRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('about-section');
      const box = sec.getBoundingClientRect();
      const card = document.querySelector('.about-image-card');
      const img = document.querySelector('.about-office-img');
      const cBox = card.getBoundingClientRect();
      const iBox = img.getBoundingClientRect();

      return JSON.stringify({
        pageY: Math.round(box.top + window.scrollY),
        height: Math.round(box.height),
        width: Math.round(box.width),
        cardHeight: Math.round(cBox.height),
        imgHeight: Math.round(iBox.height),
        imgNaturalW: img.naturalWidth,
        imgNaturalH: img.naturalHeight,
        imgComplete: img.complete
      });
    })()`,
    returnByValue: true
  });

  const data = JSON.parse(docRectRes.result.result.value);
  console.log('About section data:', data);

  const shot = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: data.pageY,
      width: 1366,
      height: data.height,
      scale: 1
    },
    captureBeyondViewport: true
  });

  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\verified_about_desktop.png', Buffer.from(shot.result.data, 'base64'));

  ws.close();
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
  process.exit(0);
}
