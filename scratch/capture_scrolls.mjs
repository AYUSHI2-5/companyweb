import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9499',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_proj2_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const v = await fetch('http://127.0.0.1:9499/json/version').then(r => r.json());
  const targets = await fetch('http://127.0.0.1:9499/json/list').then(r => r.json());
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const filePath = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to 800
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 800)' });
  await new Promise(r => setTimeout(r, 500));
  const shotMid1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/project_mid1.png', Buffer.from(shotMid1.data, 'base64'));

  // Scroll to 1700
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1700)' });
  await new Promise(r => setTimeout(r, 500));
  const shotMid2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/project_mid2.png', Buffer.from(shotMid2.data, 'base64'));

  // Scroll to bottom
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 3000)' });
  await new Promise(r => setTimeout(r, 500));
  const shotBot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/project_bot.png', Buffer.from(shotBot.data, 'base64'));

  console.log('Scroll screenshots saved');
  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

