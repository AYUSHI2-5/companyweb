import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_align_verify_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9360',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9360/json/version');
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
  await sendSession('Runtime.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/vishan-institute-of-technology/' });
  await new Promise(r => setTimeout(r, 1200));

  // Simulate user scrolling slightly to trigger scroll-focused animation
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo({ top: 10, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    })()`
  });
  await new Promise(r => setTimeout(r, 950));

  const measurements = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const goals = document.querySelector('.project-content-block');
      const leftCol = document.querySelector('.project-left-col');
      const rightCol = document.querySelector('.project-right-col');
      const specsCard = document.querySelector('.specs-unified-card');

      const leftColRect = leftCol.getBoundingClientRect();
      const rightColRect = rightCol.getBoundingClientRect();
      const goalsRect = goals.getBoundingClientRect();
      const specsRect = specsCard.getBoundingClientRect();

      return {
        leftColTop: leftColRect.top,
        rightColTop: rightColRect.top,
        goalsTop: goalsRect.top,
        specsTop: specsRect.top,
        difference: rightColRect.top - leftColRect.top,
        scrollY: window.scrollY
      };
    })()`,
    returnByValue: true
  });

  console.log('ALIGNMENT MEASUREMENTS AFTER SCROLL:', JSON.stringify(measurements.result?.result?.value, null, 2));

  // Take screenshot showing goals and specs card side-by-side
  const shot1 = await sendSession('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 800, scale: 1 }
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_sidebar_aligned_beside_goals.png'), Buffer.from(shot1.result.data, 'base64'));

  // Now simulate scroll to verify sticky behavior
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 300, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 400));

  const scrolledMeasurements = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const rightCol = document.querySelector('.project-right-col');
      return {
        scrollY: window.scrollY,
        rightColTop: rightCol.getBoundingClientRect().top,
        rightColPosition: window.getComputedStyle(rightCol).position
      };
    })()`,
    returnByValue: true
  });
  console.log('SCROLLED MEASUREMENTS:', JSON.stringify(scrolledMeasurements.result?.result?.value, null, 2));

  const shot2 = await sendSession('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 800, scale: 1 }
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_sidebar_sticky_scrolled.png'), Buffer.from(shot2.result.data, 'base64'));

  ws.close();
  chrome.kill();
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}
