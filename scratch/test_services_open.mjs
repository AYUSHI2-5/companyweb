import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9499',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_serv_all_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9499/json/version').then(r => r.json());
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
  await ssend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1.5, mobile: false });
  await ssend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2500));

  await ssend('Runtime.evaluate', { expression: `document.getElementById('services-section').scrollIntoView({behavior: 'instant'});` });
  await new Promise(r => setTimeout(r, 800));

  // Item 1
  await ssend('Runtime.evaluate', { expression: `window.BaadamServices.open(0);` });
  await new Promise(r => setTimeout(r, 600));
  let shot = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_open_item1.png', Buffer.from(shot.result.data, 'base64'));

  // Item 4
  await ssend('Runtime.evaluate', { expression: `window.BaadamServices.open(3);` });
  await new Promise(r => setTimeout(r, 600));
  shot = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_open_item4.png', Buffer.from(shot.result.data, 'base64'));

  // Item 6
  await ssend('Runtime.evaluate', { expression: `window.BaadamServices.open(5);` });
  await new Promise(r => setTimeout(r, 600));
  shot = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_open_item6.png', Buffer.from(shot.result.data, 'base64'));

  console.log('Successfully captured item 1, 4, 6!');

  await ws.close();
} finally {
  chrome.kill();
}
