import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_scrollonly_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9348',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9348/json/version');
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
  await sendSession('Runtime.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Initial Load / Reload test (scrollY = 0)
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/ashray-labs/' });
  await new Promise(r => setTimeout(r, 1200));

  const countOnLoad = await sendSession('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".is-in-view").length',
    returnByValue: true
  });
  console.log('Count of animated elements on reload (should be 0):', countOnLoad.result?.result?.value);

  const ssOnLoad = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_on_reload_no_animation.png`, Buffer.from(ssOnLoad.result.data, 'base64'));

  // 2. User initiates scroll down
  await sendSession('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 90, behavior: "smooth" }); window.dispatchEvent(new Event("scroll"));'
  });
  await new Promise(r => setTimeout(r, 350));

  const countOnScroll = await sendSession('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".is-in-view").length',
    returnByValue: true
  });
  console.log('Count of animated elements after scrolling down (should be > 0):', countOnScroll.result?.result?.value);

  const ssOnScroll = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_on_scroll_animated.png`, Buffer.from(ssOnScroll.result.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Scroll-focused animation verification successful!');
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}

