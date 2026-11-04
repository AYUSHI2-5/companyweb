import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_debug_scroll_up_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9255',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9255/json/version');
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
  await sendSession('Input.setIgnoreInputEvents', { ignore: false });

  for (const page of ['about.html', 'services.html', 'portfolio.html', 'contact.html']) {
    console.log(`\n================= TESTING ${page} =================`);
    await sendSession('Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 2000));

    // Measure page dimensions
    const dims = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        return {
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          scrollY: window.scrollY,
          activeElement: document.activeElement ? document.activeElement.tagName : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Dimensions on load:', dims.result.result.value);

    // Scroll to bottom (e.g. 3000px down)
    await sendSession('Runtime.evaluate', {
      expression: `window.scrollTo(0, 3000);`
    });
    await new Promise(r => setTimeout(r, 800));

    const afterScrollDown = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('ScrollY after scrollTo 3000:', afterScrollDown.result.result.value);

    // Test mouse wheel UP at center of page (x=700, y=500)
    for (let i = 1; i <= 5; i++) {
      await sendSession('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 700,
        y: 500,
        deltaX: 0,
        deltaY: -150
      });
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 500));

    const afterWheelUp = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('ScrollY after 5 wheel events up (-150 each):', afterWheelUp.result.result.value);

    // Test mouse wheel UP near bottom (inside footer)
    await sendSession('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.documentElement.scrollHeight);`
    });
    await new Promise(r => setTimeout(r, 800));

    const atBottomY = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('ScrollY at very bottom:', atBottomY.result.result.value);

    // Scroll up from footer
    for (let i = 1; i <= 5; i++) {
      await sendSession('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 700,
        y: 500,
        deltaX: 0,
        deltaY: -150
      });
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 500));

    const afterWheelFromFooter = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('ScrollY after 5 wheel events up from footer:', afterWheelFromFooter.result.result.value);
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

