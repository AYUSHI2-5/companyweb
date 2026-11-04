import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_sim_scroll_all_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9260',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9260/json/version');
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

  for (const page of ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']) {
    console.log(`\n=================== ${page} ===================`);
    await sendSession('Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1200));

    const scrollHeight = (await sendSession('Runtime.evaluate', {
      expression: `document.documentElement.scrollHeight`,
      returnByValue: true
    })).result.result.value;

    const maxScroll = scrollHeight - 900;
    console.log(`scrollHeight: ${scrollHeight}px, maxScroll: ${maxScroll}px`);

    // Jump to bottom
    await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, ${maxScroll});` });
    await new Promise(r => setTimeout(r, 400));
    const atBottom = (await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true })).result.result.value;
    console.log(`At bottom: ${atBottom}`);

    // Wheel up 10 ticks (-120 each)
    for (let i = 0; i < 10; i++) {
      await sendSession('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 720,
        y: 450,
        deltaX: 0,
        deltaY: -120
      });
      await new Promise(r => setTimeout(r, 20));
    }
    await new Promise(r => setTimeout(r, 300));

    const afterWheelUp = (await sendSession('Runtime.evaluate', { expression: `window.scrollY`, returnByValue: true })).result.result.value;
    const diff = atBottom - afterWheelUp;
    console.log(`After 10 wheel ticks up: ${afterWheelUp} (moved up by ${diff}px)`);

    // Verify it moved UP substantially
    if (diff > 800) {
      console.log(`SUCCESS: Page freely and smoothly scrolls up without resistance!`);
    } else {
      console.log(`WARNING: diff was only ${diff}px`);
    }
  }

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

