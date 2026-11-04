import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_test_scroll_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9251',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9251/json/version');
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
  await new Promise(r => setTimeout(r, 1000));

  const check1 = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      return {
        initialScrollY: window.scrollY,
        bodyHeight: document.body.scrollHeight,
        docHeight: document.documentElement.scrollHeight
      };
    })()`,
    returnByValue: true
  });
  console.log('Check 1:', check1.result.result.value);

  // Scroll to 1000
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1300, behavior: 'instant' });`
  });

  await new Promise(r => setTimeout(r, 200));

  const check2 = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      return {
        scrollYAfter1300: window.scrollY
      };
    })()`,
    returnByValue: true
  });
  console.log('Check 2:', check2.result.result.value);

  await new Promise(r => setTimeout(r, 2000));

  const check3 = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      return {
        scrollYAfter2s: window.scrollY
      };
    })()`,
    returnByValue: true
  });
  console.log('Check 3:', check3.result.result.value);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

