import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_test_scroll_all_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9254',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9254/json/version');
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

  const pages = ['services.html', 'about.html', 'portfolio.html', 'contact.html'];

  for (const page of pages) {
    console.log(`\n--- Testing ${page} ---`);
    await sendSession('Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1500));

    // Get page metrics & elements
    const pageInfo = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        return {
          title: document.title,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          scrollY: window.scrollY,
          overflowHtml: window.getComputedStyle(document.documentElement).overflow,
          overflowBody: window.getComputedStyle(document.body).overflow,
          scrollSnapHtml: window.getComputedStyle(document.documentElement).scrollSnapType,
          footerHeight: document.querySelector('.site-footer')?.offsetHeight,
          footerStyleHeight: document.querySelector('.site-footer') ? window.getComputedStyle(document.querySelector('.site-footer')).height : null,
          footerSnap: document.querySelector('.site-footer') ? window.getComputedStyle(document.querySelector('.site-footer')).scrollSnapAlign : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Page info:', pageInfo.result.result.value);

    // Scroll to bottom
    await sendSession('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.documentElement.scrollHeight);`
    });
    await new Promise(r => setTimeout(r, 500));
    const atBottom = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('Scrolled to bottom:', atBottom.result.result.value);

    // Try to scroll UP by wheel event or scrollTo
    // Test 1: window.scrollBy(0, -500)
    await sendSession('Runtime.evaluate', {
      expression: `window.scrollBy(0, -500);`
    });
    await new Promise(r => setTimeout(r, 500));
    const afterScrollUp = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('After scrollBy(0, -500):', afterScrollUp.result.result.value);

    // Test 2: Dispatch mousewheel up
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 500,
      y: 500,
      deltaX: 0,
      deltaY: -300
    });
    await new Promise(r => setTimeout(r, 600));
    const afterWheel = await sendSession('Runtime.evaluate', {
      expression: `window.scrollY`,
      returnByValue: true
    });
    console.log('After mouseWheel up (-300):', afterWheel.result.result.value);
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

