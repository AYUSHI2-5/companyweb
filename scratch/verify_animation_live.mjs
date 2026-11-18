import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_anim_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9338',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9338/json/version');
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

  // Navigate to Ashray Labs
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/ashray-labs/' });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot initial reveal
  const ss1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_animated_detail_top.png`, Buffer.from(ss1.result.data, 'base64'));

  // Scroll down 400px to test scroll progress and in-view reveal
  await sendSession('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 380, behavior: "instant" }); window.dispatchEvent(new Event("scroll"));'
  });
  await new Promise(r => setTimeout(r, 600));

  const ss2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/verified_animated_detail_scrolled.png`, Buffer.from(ss2.result.data, 'base64'));

  // Test progress bar width in DOM
  const evalRes = await sendSession('Runtime.evaluate', {
    expression: 'document.getElementById("detail-scroll-progress").style.width'
  });
  console.log('Scroll Progress Bar Width after 380px scroll:', evalRes.result.value);

  // Check how many .motion-reveal elements have .is-in-view
  const inViewCount = await sendSession('Runtime.evaluate', {
    expression: 'document.querySelectorAll(".motion-reveal.is-in-view").length'
  });
  console.log('Number of revealed elements:', inViewCount.result.value);

  ws.close();
  chrome.kill();
  console.log('Animation tests complete!');
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}
