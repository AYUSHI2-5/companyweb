import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9482',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_serv_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9482/json/version').then(r => r.json());
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const p = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); }
  };
  function send(method, params = {}) {
    return new Promise(r => { const i = id++; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  }

  const t = await send('Target.createTarget', { url: 'about:blank' });
  const a = await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true });
  const s = a.result.sessionId;
  function ssend(method, params = {}) {
    return new Promise(r => { const i = id++; p.set(i, r); ws.send(JSON.stringify({ id: i, sessionId: s, method, params })); });
  }

  await ssend('Page.enable');
  await ssend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await ssend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Screenshot Services section
  await ssend('Runtime.evaluate', {
    expression: `
      document.querySelector('#services-section').scrollIntoView({ behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotServices = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/screenshot_services.png', Buffer.from(shotServices.result.data, 'base64'));
  console.log('Saved scratch/screenshot_services.png');

  // 2. Avatar close-up
  const shotAvatar = await ssend('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 550, width: 350, height: 350, scale: 1 }
  });
  fs.writeFileSync('scratch/screenshot_avatar.png', Buffer.from(shotAvatar.result.data, 'base64'));
  console.log('Saved scratch/screenshot_avatar.png');

  await ws.close();
} finally {
  chrome.kill();
}

