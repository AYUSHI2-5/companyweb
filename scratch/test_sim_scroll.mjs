import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_sim_scroll_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9259',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9259/json/version');
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

  for (const page of ['about.html', 'services.html', 'portfolio.html', 'contact.html']) {
    console.log(`\n=================== ${page} ===================`);
    await sendSession('Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1500));

    // Disable smooth scrolling temporarily to test pure physics vs smooth scroll
    const scrollHeight = (await sendSession('Runtime.evaluate', {
      expression: `document.documentElement.scrollHeight`,
      returnByValue: true
    })).result.result.value;

    console.log(`Total scrollHeight: ${scrollHeight}px`);

    // Let's scroll down smoothly in 5 steps to reach the bottom
    for (let s = 1; s <= 5; s++) {
      const targetY = Math.round((scrollHeight - 900) * (s / 5));
      await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, ${targetY});` });
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 1000));

    const bottomY = (await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    })).result.result.value;
    console.log(`Arrived at bottom, scrollY: ${bottomY} (expected ~${scrollHeight - 900})`);

    // Now let's try to scroll UP in 5 steps
    const upTrace = [];
    for (let s = 4; s >= 0; s--) {
      const targetY = Math.round((scrollHeight - 900) * (s / 5));
      await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, ${targetY});` });
      await new Promise(r => setTimeout(r, 200));
      const currentY = (await sendSession('Runtime.evaluate', {
        expression: `window.scrollY`,
        returnByValue: true
      })).result.result.value;
      upTrace.push({ step: s, target: targetY, actual: currentY });
    }
    await new Promise(r => setTimeout(r, 1000));
    const finalY = (await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    })).result.result.value;

    console.log('Scroll UP steps:', JSON.stringify(upTrace));
    console.log(`Final scrollY after scrolling back to top: ${finalY}`);
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

