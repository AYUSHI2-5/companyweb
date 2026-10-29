import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_footer_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9295',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9295/json/version');
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

  const tests = [
    { name: 'footer_desktop_1440', page: 'index.html', width: 1440, height: 900, dpr: 1 },
    { name: 'footer_tablet_768', page: 'index.html', width: 768, height: 1024, dpr: 2 },
    { name: 'footer_mobile_390', page: 'index.html', width: 390, height: 844, dpr: 3 },
    { name: 'footer_contact_1440', page: 'contact.html', width: 1440, height: 900, dpr: 1 }
  ];

  for (const t of tests) {
    await sessionSend('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: t.dpr,
      mobile: t.width < 768
    });

    await sessionSend('Page.navigate', { url: `http://localhost:3000/${t.page}` });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to bottom so footer is in view
    await sessionSend('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`
    });
    await new Promise(r => setTimeout(r, 1200));

    const evalRes = await sessionSend('Runtime.evaluate', {
      expression: `(() => {
        const footer = document.querySelector('.site-footer');
        const canvas = document.querySelector('.footer-bg-decor .baadam-tech-canvas');
        const decor = document.querySelector('.footer-bg-decor');
        const container = document.querySelector('.footer-container');

        return JSON.stringify({
          name: '${t.name}',
          hasFooter: !!footer,
          hasCanvas: !!canvas,
          canvasRect: canvas ? canvas.getBoundingClientRect() : null,
          footerRect: footer ? footer.getBoundingClientRect() : null,
          hasHScroll: document.documentElement.scrollWidth > window.innerWidth
        });
      })()`,
      returnByValue: true
    });

    const info = JSON.parse(evalRes.result.result.value);
    console.log(info);

    // Screenshot of the current viewport (showing footer)
    const shot = await sessionSend('Page.captureScreenshot', {
      format: 'png'
    });

    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8b148c84-3c2a-428d-a242-59e1a1ea8c82\\shot_${t.name}.png`, Buffer.from(shot.result.data, 'base64'));
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
