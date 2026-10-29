import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_empty_serv_port_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9260',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9260/json/version');
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
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Test Services page
  await sessionSend('Page.navigate', { url: 'http://localhost:3000/services.html' });
  await new Promise(r => setTimeout(r, 1200));

  const servCheck = await sessionSend('Runtime.evaluate', {
    expression: `(() => {
      return JSON.stringify({
        hasHeader: !!document.querySelector('.site-header'),
        hasFooter: !!document.querySelector('.site-footer'),
        hasPageMain: !!document.querySelector('.page-main'),
        hasOldCards: !!document.querySelector('.service-card'),
        canvasCount: document.querySelectorAll('canvas.baadam-tech-canvas').length
      });
    })()`,
    returnByValue: true
  });
  console.log('Services Page Check:', JSON.parse(servCheck.result.result.value));

  const servShot = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\services_empty_preview.png', Buffer.from(servShot.result.data, 'base64'));

  // Test Portfolio page
  await sessionSend('Page.navigate', { url: 'http://localhost:3000/portfolio.html' });
  await new Promise(r => setTimeout(r, 1200));

  const portCheck = await sessionSend('Runtime.evaluate', {
    expression: `(() => {
      return JSON.stringify({
        hasHeader: !!document.querySelector('.site-header'),
        hasFooter: !!document.querySelector('.site-footer'),
        hasPageMain: !!document.querySelector('.page-main'),
        hasOldProjects: !!document.querySelector('.portfolio-card'),
        canvasCount: document.querySelectorAll('canvas.baadam-tech-canvas').length
      });
    })()`,
    returnByValue: true
  });
  console.log('Portfolio Page Check:', JSON.parse(portCheck.result.result.value));

  const portShot = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\portfolio_empty_preview.png', Buffer.from(portShot.result.data, 'base64'));

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (err) {}
}
