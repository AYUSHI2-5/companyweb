import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_pages_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9292',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9292/json/version');
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

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

  const pages = ['about.html', 'services.html', 'portfolio.html', 'contact.html'];

  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  for (const page of pages) {
    await sessionSend('Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1200));

    const evalRes = await sessionSend('Runtime.evaluate', {
      expression: `(() => {
        const canvases = document.querySelectorAll('canvas.baadam-tech-canvas');
        return JSON.stringify({
          page: '${page}',
          canvasesCount: canvases.length,
          canvasDimensions: Array.from(canvases).map(c => ({
            w: c.width,
            h: c.height,
            styleW: c.style.width,
            styleH: c.style.height
          })),
          hasHScroll: document.documentElement.scrollWidth > window.innerWidth
        });
      })()`,
      returnByValue: true
    });

    console.log(JSON.parse(evalRes.result.result.value));

    const shot = await sessionSend('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 750, scale: 1 }
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8b148c84-3c2a-428d-a242-59e1a1ea8c82\\shot_${page.replace('.html', '')}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (err) {}
}
