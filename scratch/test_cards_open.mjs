import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9485',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_serv_cards_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9485/json/version').then(r => r.json());
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
  await ssend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await ssend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Open card 4: E-Commerce Development
  await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelector('#services-section').scrollIntoView({ behavior: 'instant' });
        const item4 = document.querySelector('.service-acc-item[data-index="4"]');
        item4.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotCard4 = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/screenshot_card4_open.png', Buffer.from(shotCard4.result.data, 'base64'));

  // Open card 6: Game Development
  await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const item6 = document.querySelector('.service-acc-item[data-index="6"]');
        item6.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotCard6 = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/screenshot_card6_open.png', Buffer.from(shotCard6.result.data, 'base64'));
  console.log('Saved card 4 and card 6 screenshots');

  await ws.close();
} finally {
  chrome.kill();
}

