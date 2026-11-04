import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9469',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_rad_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9469/json/version').then(r => r.json());
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
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to radar section
  await ssend('Runtime.evaluate', {
    expression: `
      document.getElementById('radar-section').scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const measurements = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const sec = document.getElementById('radar-section');
        const canvas = document.getElementById('brandRadarCanvas');
        return {
          secOffset: sec.offsetHeight,
          secScroll: sec.scrollHeight,
          canvasW: canvas.offsetWidth,
          canvasH: canvas.offsetHeight
        };
      })()
    `,
    returnByValue: true
  });
  console.log("Measurements on 1440x900:", measurements.result.result.value);

  const shot = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/radar_large_1440.png', Buffer.from(shot.result.data, 'base64'));

  // Test on 1280x720 laptop resolution too
  await ssend('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));
  const shot720 = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/radar_large_720.png', Buffer.from(shot720.result.data, 'base64'));

  console.log("Radar screenshots captured!");

  await ws.close();
} finally {
  chrome.kill();
}

