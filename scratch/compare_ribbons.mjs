import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_team_compare';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9235',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9235/json/version');
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

  // Option A: using assets/team-ribbon-bottom.jpg
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('.team-section');
      sec.classList.add('is-visible');
      
      // Remove pink arc
      const arc = document.querySelector('.team-arc-left');
      if (arc) arc.style.display = 'none';

      // Adjust padding
      sec.style.padding = '5.25rem 0 9.25rem';

      // Update ribbon image
      const rib = document.querySelector('.team-ribbon-bg-img');
      rib.src = 'assets/team-ribbon-bottom.jpg';
      rib.style.maxHeight = '145px';
      rib.style.bottom = '0';
      rib.style.opacity = '0.9';
      rib.style.mixBlendMode = 'multiply';
    })()`
  });

  await new Promise(r => setTimeout(r, 800));

  const rectA = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('.team-section');
      const box = sec.getBoundingClientRect();
      return JSON.stringify({
        pageY: Math.round(box.top + window.scrollY),
        height: Math.round(box.height)
      });
    })()`,
    returnByValue: true
  });
  const dataA = JSON.parse(rectA.result.result.value);

  const shotA = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: dataA.pageY,
      width: 1440,
      height: dataA.height,
      scale: 1
    },
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\team_option_red_white.png', Buffer.from(shotA.result.data, 'base64'));

  // Option B: using assets/hero-ribbon-flow.jpg with adjusted height
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const rib = document.querySelector('.team-ribbon-bg-img');
      rib.src = 'assets/hero-ribbon-flow.jpg';
      rib.style.maxHeight = '140px';
      rib.style.bottom = '0';
      rib.style.opacity = '0.9';
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const shotB = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: dataA.pageY,
      width: 1440,
      height: dataA.height,
      scale: 1
    },
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\team_option_hero_flow.png', Buffer.from(shotB.result.data, 'base64'));

  console.log('Saved comparison shots');
  ws.close();
} finally {
  chrome.kill();
  process.exit(0);
}
