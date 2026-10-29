import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_diagnose_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9277',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9277/json/version');
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

  const consoleLogs = [];
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({ type: msg.params.type, args: msg.params.args.map(a => a.value) });
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleLogs.push({ exception: msg.params.exceptionDetails });
    }
  });

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900, dpr: 1 },
    { name: 'laptop_1200', width: 1200, height: 800, dpr: 1 },
    { name: 'tablet_768', width: 768, height: 1024, dpr: 2 },
    { name: 'mobile_390', width: 390, height: 844, dpr: 3 },
    { name: 'mobile_320', width: 320, height: 568, dpr: 2 }
  ];

  await sessionSend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  for (const vp of viewports) {
    await sessionSend('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.width < 768
    });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await sessionSend('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHScroll = docWidth > winWidth;

        const hero = document.querySelector('.hero-section');
        const heroBg = document.querySelector('.hero-bg-decor');
        const canvas = document.querySelector('.hero-bg-decor .baadam-tech-canvas');
        const marquee = document.querySelector('.tech-marquee-wrapper');
        const heroVisual = document.querySelector('.hero-visual');
        const heroContent = document.querySelector('.hero-content');

        // Check overflowing elements
        const allEls = document.querySelectorAll('*');
        const overflowing = [];
        allEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1 || rect.left < -1) {
            overflowing.push({
              tag: el.tagName,
              cls: el.className,
              rect: { left: rect.left, right: rect.right, width: rect.width }
            });
          }
        });

        return JSON.stringify({
          viewport: { width: winWidth, scrollWidth: docWidth, hasHScroll },
          heroRect: hero ? hero.getBoundingClientRect() : null,
          heroBgRect: heroBg ? heroBg.getBoundingClientRect() : null,
          canvasRect: canvas ? canvas.getBoundingClientRect() : null,
          canvasAttrs: canvas ? { width: canvas.width, height: canvas.height, styleW: canvas.style.width, styleH: canvas.style.height } : null,
          marqueeRect: marquee ? marquee.getBoundingClientRect() : null,
          overflowCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 5)
        });
      })()`,
      returnByValue: true
    });

    const data = JSON.parse(evalRes.result.result.value);
    console.log(`[${vp.name}] Result:`, data);

    const shot = await sessionSend('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900), scale: 1 }
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8b148c84-3c2a-428d-a242-59e1a1ea8c82\\shot_${vp.name}.png`, Buffer.from(shot.result.data, 'base64'));
  }

  console.log('Console logs:', consoleLogs);
  ws.close();
} catch (e) {
  console.error('Error during diagnosis:', e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (err) {}
}
