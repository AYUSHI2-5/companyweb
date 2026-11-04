import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_approach2_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9250',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9250/json/version');
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

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
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const targetRes = await send('Target.createTarget', { url: 'about:blank' });
  const targetId = targetRes.result.targetId;
  const attachRes = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  const check = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const allSections = Array.from(document.querySelectorAll('section')).map(s => ({
        id: s.id,
        className: s.className,
        offsetTop: s.offsetTop,
        offsetHeight: s.offsetHeight
      }));
      return allSections;
    })()`,
    returnByValue: true
  });
  console.log('Sections found:', JSON.stringify(check.result.result.value, null, 2));

  // Now scroll specifically to our-approach offsetTop
  const approachOffset = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('our-approach');
      if (el) {
        window.scrollTo(0, el.offsetTop - 40);
        return { offsetTop: el.offsetTop, scrollY: window.scrollY };
      }
      return null;
    })()`,
    returnByValue: true
  });
  console.log('Scroll info:', JSON.stringify(approachOffset.result.result.value));

  await new Promise(r => setTimeout(r, 1000));

  const desktopSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_our_approach_desktop.png', Buffer.from(desktopSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_our_approach_desktop.png');

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

