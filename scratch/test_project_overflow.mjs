import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testFile = path.resolve('projects/kp-e-services/index.html').replace(/\\/g, '/');
const fileUrl = 'file:///' + testFile;

const port = 9522;
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_proj_test_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
  const ws = new WebSocket(v.webSocketDebuggerUrl);

  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        res(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1500));

  const viewports = [
    { name: 'Desktop (1440px)', width: 1440, height: 900 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Mobile (390px)', width: 390, height: 844 }
  ];

  console.log('--- TESTING VIEWPORT RESPONSIVENESS ---');
  let hasOverflow = false;

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 640
    });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      expression: '({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, innerWidth: window.innerWidth })',
      returnByValue: true
    });

    const val = evalRes.result.value;
    const diff = val.scrollWidth - val.clientWidth;
    const status = diff <= 0 ? 'PASS (0px overflow)' : `FAIL (${diff}px overflow!)`;
    console.log(`${vp.name}: ${status} [scrollWidth: ${val.scrollWidth}, clientWidth: ${val.clientWidth}]`);
    if (diff > 0) hasOverflow = true;
  }

  if (!hasOverflow) {
    console.log('\nSUCCESS: 100% responsive across desktop, tablet, and mobile with ZERO overflow!');
  } else {
    console.log('\nWARNING: Horizontal overflow detected!');
  }

  ws.close();
} catch (err) {
  console.error('Test error:', err);
} finally {
  chrome.kill();
}

