import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9466',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_footer_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const targets = await fetch('http://127.0.0.1:9466/json/list').then(r => r.json());
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

  // 1. Capture footer on project detail page
  await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html' });
  await new Promise(r => setTimeout(r, 1500));
  await send('Runtime.evaluate', { expression: "document.querySelector('footer').scrollIntoView()" });
  await new Promise(r => setTimeout(r, 600));
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/footer_project_before.png', Buffer.from(shot.data, 'base64'));

  // 2. Capture footer on homepage
  await send('Page.navigate', { url: 'file:///C:/Users/Admin/Desktop/Baadam.com/index.html' });
  await new Promise(r => setTimeout(r, 1500));
  await send('Runtime.evaluate', { expression: "document.querySelector('footer').scrollIntoView()" });
  await new Promise(r => setTimeout(r, 600));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/footer_home.png', Buffer.from(shot.data, 'base64'));

  console.log('Footers captured successfully');
  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

