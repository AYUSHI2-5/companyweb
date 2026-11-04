import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_snap_t_' + Date.now();
const port = 9377;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise(resolve => {
      const cur = id++;
      pending.set(cur, resolve);
      ws.send(JSON.stringify({ id: cur, method, params }));
    });
  }

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 600,
    height: 600,
    deviceScaleFactor: 2,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:3000/scratch/preview_teacher_avatar.html' });
  await new Promise(r => setTimeout(r, 1500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\Desktop\\Baadam.com\\scratch\\snap_teacher_preview.png', Buffer.from(shot.result.data, 'base64'));
  console.log('Saved snap_teacher_preview.png');

  ws.close();
} catch (e) {
  console.error('Error:', e);
} finally {
  chrome.kill();
}

