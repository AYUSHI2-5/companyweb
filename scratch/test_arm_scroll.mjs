import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_arm_snap_' + Date.now();
const port = 9388;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

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
  await send('DOM.enable');
  await send('CSS.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  const fileUrl = 'file:///C:/Users/Admin/Desktop/Baadam.com/index.html';
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1500));

  // Snap 1: at top (y=0)
  const snap1 = await send('Page.captureScreenshot', {
    clip: { x: 20, y: 550, width: 220, height: 250, scale: 1 }
  });
  fs.writeFileSync('scratch/snap_arm_top.png', Buffer.from(snap1.result.data, 'base64'));
  console.log('Saved scratch/snap_arm_top.png');

  // Scroll to middle
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.documentElement.scrollHeight * 0.5);' });
  await new Promise(r => setTimeout(r, 800));

  const snap2 = await send('Page.captureScreenshot', {
    clip: { x: 20, y: 550, width: 220, height: 250, scale: 1 }
  });
  fs.writeFileSync('scratch/snap_arm_mid.png', Buffer.from(snap2.result.data, 'base64'));
  console.log('Saved scratch/snap_arm_mid.png');

  // Scroll to bottom
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.documentElement.scrollHeight);' });
  await new Promise(r => setTimeout(r, 800));

  const snap3 = await send('Page.captureScreenshot', {
    clip: { x: 20, y: 550, width: 220, height: 250, scale: 1 }
  });
  fs.writeFileSync('scratch/snap_arm_bottom.png', Buffer.from(snap3.result.data, 'base64'));
  console.log('Saved scratch/snap_arm_bottom.png');

  ws.close();
} finally {
  chrome.kill();
}

