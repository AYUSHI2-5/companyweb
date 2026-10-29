import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_test_mask2';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9237',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9237/json/version');
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

  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('.team-section');
      sec.classList.add('is-visible');
      
      const arc = document.querySelector('.team-arc-left');
      if (arc) arc.style.display = 'none';

      // Clean generous padding so cards & pagination have breathing space from ribbon
      sec.style.padding = '5.25rem 0 8.5rem';

      const rib = document.querySelector('.team-ribbon-bg-img');
      rib.src = 'assets/team-ribbon-bottom.jpg';
      rib.style.bottom = '0';
      rib.style.left = '50%';
      rib.style.transform = 'translateX(-50%) var(--ribbon-parallax, translate3d(0, 0, 0))';
      rib.style.width = '100%';
      rib.style.maxWidth = 'min(1560px, 100vw)';
      rib.style.height = 'auto';
      rib.style.maxHeight = '115px';
      rib.style.objectFit = 'contain';
      rib.style.objectPosition = 'center bottom';
      rib.style.opacity = '0.9';
      rib.style.mixBlendMode = 'multiply';
      rib.style.maskImage = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 30%, black 100%)';
      rib.style.webkitMaskImage = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 30%, black 100%)';

      const pag = document.querySelector('.team-pagination');
      pag.style.marginTop = '1.75rem';
    })()`
  });

  await new Promise(r => setTimeout(r, 800));

  const rect = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('.team-section');
      const box = sec.getBoundingClientRect();
      const pag = document.querySelector('.team-pagination').getBoundingClientRect();
      const rib = document.querySelector('.team-ribbon-bg-img').getBoundingClientRect();
      return JSON.stringify({
        pageY: Math.round(box.top + window.scrollY),
        height: Math.round(box.height),
        pagBottom: Math.round(pag.bottom),
        ribTop: Math.round(rib.top),
        diff: Math.round(rib.top - pag.bottom)
      });
    })()`,
    returnByValue: true
  });
  console.log('Result:', rect.result.result.value);
  const data = JSON.parse(rect.result.result.value);

  const shot = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: data.pageY,
      width: 1440,
      height: data.height,
      scale: 1
    },
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\team_feathered_perfect.png', Buffer.from(shot.result.data, 'base64'));

  ws.close();
} finally {
  chrome.kill();
  process.exit(0);
}
