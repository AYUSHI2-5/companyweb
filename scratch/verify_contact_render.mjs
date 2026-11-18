import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9495',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cont_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9495/json/version').then(r => r.json());
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const targets = await fetch('http://127.0.0.1:9495/json/list').then(r => r.json());
  const pageTarget = targets.find(t => t.type === 'page');
  const pageWs = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => pageWs.onopen = r);

  let pid = 1;
  const sendPage = (method, params = {}) => new Promise((resolve) => {
    const curId = pid++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        pageWs.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    pageWs.addEventListener('message', handler);
    pageWs.send(JSON.stringify({ id: curId, method, params }));
  });

  await sendPage('Page.enable');

  // Test at 1440x900
  await sendPage('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendPage('Page.navigate', { url: 'http://localhost:3000/contact.html' });
  await new Promise(r => setTimeout(r, 1500));

  let shot1 = await sendPage('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/contact_verified_1440.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved scratch/contact_verified_1440.png');

  // Test at 1024x768 (user viewport)
  await sendPage('Emulation.setDeviceMetricsOverride', {
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });

  await new Promise(r => setTimeout(r, 1000));
  let shot2 = await sendPage('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/contact_verified_1024.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved scratch/contact_verified_1024.png');

  ws.close();
  pageWs.close();
} finally {
  chrome.kill();
}
