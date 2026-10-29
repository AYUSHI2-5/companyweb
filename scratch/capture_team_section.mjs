import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_team_inspect';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9232',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  const evalRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('.team-section');
      if (sec) {
        sec.classList.add('is-visible');
      }
      const r = sec.getBoundingClientRect();
      const ribbon = document.querySelector('.team-ribbon-bg-img');
      const ribR = ribbon ? ribbon.getBoundingClientRect() : null;
      const pag = document.querySelector('.team-pagination');
      const pagR = pag ? pag.getBoundingClientRect() : null;
      const cards = document.querySelector('.team-cards-grid');
      const cardsR = cards ? cards.getBoundingClientRect() : null;
      return JSON.stringify({
        sec: { top: r.top, bottom: r.bottom, height: r.height, pageY: window.scrollY + r.top },
        ribbon: ribR ? { top: ribR.top, bottom: ribR.bottom, height: ribR.height } : null,
        pag: pagR ? { top: pagR.top, bottom: pagR.bottom, height: pagR.height } : null,
        cards: cardsR ? { top: cardsR.top, bottom: cardsR.bottom, height: cardsR.height } : null
      });
    })()`,
    returnByValue: true
  });

  const parsed = JSON.parse(evalRes.result.result.value);
  console.log('Metrics:', parsed);

  await new Promise(r => setTimeout(r, 500));

  const pageY = parsed.sec.pageY;
  const height = parsed.sec.height;

  const shot = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: pageY,
      width: 1440,
      height: height,
      scale: 1
    },
    captureBeyondViewport: true
  });

  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\current_team_section.png', Buffer.from(shot.result.data, 'base64'));
  console.log('Saved current_team_section.png');

  ws.close();
} finally {
  chrome.kill();
  process.exit(0);
}
