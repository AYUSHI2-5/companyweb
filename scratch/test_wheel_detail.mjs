import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_wheel_test_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9257',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9257/json/version');
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

  await sendSession('Page.navigate', { url: `http://localhost:3000/about.html` });
  await new Promise(r => setTimeout(r, 1500));

  // Let's scroll down to middle: offset 2500
  await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, 2500);` });
  await new Promise(r => setTimeout(r, 500));

  console.log('Position after scroll down to 2500:');
  const pos1 = await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true });
  console.log('scrollY:', pos1.result.result.value);

  // Now simulate 1 mousewheel up: deltaY = -120 (standard Windows mousewheel tick)
  console.log('\n--- 1 wheel tick up (-120) ---');
  await sendSession('Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: 720,
    y: 450,
    deltaX: 0,
    deltaY: -120
  });
  await new Promise(r => setTimeout(r, 300));
  const pos2 = await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true });
  console.log('scrollY after 1 tick:', pos2.result.result.value);

  // Now simulate rapid 10 wheel ticks up
  console.log('\n--- Rapid 10 wheel ticks up ---');
  for (let i = 0; i < 10; i++) {
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 720,
      y: 450,
      deltaX: 0,
      deltaY: -120
    });
    await new Promise(r => setTimeout(r, 40));
  }
  await new Promise(r => setTimeout(r, 600));
  const pos3 = await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true });
  console.log('scrollY after 10 ticks:', pos3.result.result.value);

  // Now test near bottom of about.html (inside cta-banner or footer)
  console.log('\n--- Scroll to footer ---');
  await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, document.documentElement.scrollHeight - 900);` });
  await new Promise(r => setTimeout(r, 500));
  const posFooter = await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true });
  console.log('scrollY in footer:', posFooter.result.result.value);

  // Wheel up inside footer
  console.log('\n--- Wheel up inside footer (10 ticks) ---');
  for (let i = 0; i < 10; i++) {
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 720,
      y: 450,
      deltaX: 0,
      deltaY: -120
    });
    await new Promise(r => setTimeout(r, 40));
  }
  await new Promise(r => setTimeout(r, 600));
  const posAfterFooter = await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true });
  console.log('scrollY after 10 ticks from footer:', posAfterFooter.result.result.value);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

