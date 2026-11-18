import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9499',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_port2_' + Date.now(),
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
  const filePath = 'file:///C:/Users/Admin/Desktop/Baadam.com/portfolio.html';
  await send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 2000));

  // Click on Mobile Applications filter tab
  await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".portfolio-filter-btn")[1].click()' });
  await send('Runtime.evaluate', { expression: 'document.getElementById("portfolio-filters").scrollIntoView()' });
  await new Promise(r => setTimeout(r, 600));
  const shotFilterMob = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/portfolio_filtered_top.png', Buffer.from(shotFilterMob.data, 'base64'));

  // Click on Enterprise Software tab
  await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".portfolio-filter-btn")[3].click()' });
  await send('Runtime.evaluate', { expression: 'document.getElementById("portfolio-filters").scrollIntoView()' });
  await new Promise(r => setTimeout(r, 600));
  const shotFilterEnt = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/portfolio_filtered_enterprise.png', Buffer.from(shotFilterEnt.data, 'base64'));

  console.log('Filtered top screenshots captured');
  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

