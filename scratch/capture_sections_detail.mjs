import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9499',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_slices_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const filePath = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 2000));

  // Get total document height
  const docMetrics = await send('Runtime.evaluate', {
    expression: '({ height: document.documentElement.scrollHeight, width: 1440 })',
    returnByValue: true
  });
  const totalH = docMetrics.result.value.height;
  console.log('Total document height:', totalH);

  // Scroll and capture slices of 1000px height
  const sliceHeight = 1000;
  let currentY = 0;
  let sliceIdx = 1;

  while (currentY < totalH) {
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, ${currentY})`
    });
    await new Promise(r => setTimeout(r, 300));

    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const filename = `scratch/slice_${String(sliceIdx).padStart(2, '0')}.png`;
    fs.writeFileSync(filename, Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${filename} at Y=${currentY}`);

    currentY += 800;
    sliceIdx++;
  }

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

