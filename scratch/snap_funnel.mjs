import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_funnel_' + Date.now();
const port = 9335;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
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
  const attachRes = await send('Target.attachToTarget', { targetId: targetRes.result.targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sessionSend(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sessionSend('Page.enable');
  await sessionSend('Runtime.enable');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });

  const url = 'http://localhost:3000/index.html';
  console.log('Navigating to', url);
  await sessionSend('Page.navigate', { url });

  await new Promise(r => setTimeout(r, 2500));

  // Inspect funnel section
  const check = await sessionSend('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const sec = document.getElementById('funnel-section');
        if (!sec) return { found: false };
        const rect = sec.getBoundingClientRect();
        return {
          found: true,
          top: rect.top,
          offsetTop: sec.offsetTop,
          cardsCount: sec.querySelectorAll('.funnel-card').length,
          title: sec.querySelector('.funnel-main-title')?.innerText
        };
      })()
    `
  });
  console.log('Funnel check:', check.result?.result?.value || check);

  // Scroll directly to funnel section
  await sessionSend('Runtime.evaluate', {
    expression: `
      (() => {
        const sec = document.getElementById('funnel-section');
        if (sec) {
          sec.scrollIntoView({ behavior: 'instant', block: 'start' });
          sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  const snap = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_funnel_direct.png', Buffer.from(snap.result.data, 'base64'));
  console.log('Saved scratch/snap_funnel_direct.png');

  await ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
