import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_about_vp_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9400',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9400/json/version');
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise(r => { const msgId = id++; pending.set(msgId, r); ws.send(JSON.stringify({ id: msgId, method, params })); });
  const t = await send('Target.createTarget', { url: 'about:blank' });
  const att = await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true });
  const sId = att.result.sessionId;
  const sendS = (method, params = {}) => new Promise(r => { const msgId = id++; pending.set(msgId, r); ws.send(JSON.stringify({ id: msgId, sessionId: sId, method, params })); });

  await sendS('Page.enable');
  await sendS('Runtime.enable');
  await sendS('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  await sendS('Page.navigate', { url: 'http://localhost:8080/about.html' });
  await new Promise(r => setTimeout(r, 1200));

  await sendS('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('testimonials');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  const shot = await sendS('Page.captureScreenshot', {});
  fs.writeFileSync(path.join(artifactDir, 'verified_about_testimonials_heading_fixed.png'), Buffer.from(shot.result.data, 'base64'));

  ws.close();
  chrome.kill();
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}
