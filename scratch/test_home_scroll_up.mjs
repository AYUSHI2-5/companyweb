import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_test_home_scroll_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9261',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9261/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: `http://localhost:3000/index.html` });
  await new Promise(r => setTimeout(r, 2000));

  console.log('--- Initial Homepage ---');
  let y = (await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true })).result.result.value;
  console.log('scrollY:', y);

  // Scroll to section 1 (radar-section at 900)
  console.log('\n--- Scroll down to section 1 ---');
  await sendSession('Runtime.evaluate', { expression: `document.getElementById('radar-section').scrollIntoView({ behavior: 'instant', block: 'start' });` });
  await new Promise(r => setTimeout(r, 600));
  y = (await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true })).result.result.value;
  console.log('scrollY at radar-section:', y);

  // Now wheel up to return to hero-section
  console.log('\n--- Wheel up from radar-section ---');
  for (let i = 0; i < 6; i++) {
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 720,
      y: 450,
      deltaX: 0,
      deltaY: -150
    });
    await new Promise(r => setTimeout(r, 50));
  }
  await new Promise(r => setTimeout(r, 800));
  y = (await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true })).result.result.value;
  console.log('scrollY after wheeling up:', y);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

