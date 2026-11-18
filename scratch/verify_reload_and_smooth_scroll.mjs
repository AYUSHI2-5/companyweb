import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_smooth_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9380',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9380/json/version');
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

  // STEP 1: Navigate to page (simulating fresh load / reload)
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/vishan-institute-of-technology/' });
  await new Promise(r => setTimeout(r, 1200));

  // STEP 2: Measure elements at scrollY = 0 right on reload
  const reloadState = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const goals = document.querySelector('.project-content-block');
      const specs = document.querySelector('.specs-unified-card');
      const results = document.querySelectorAll('.project-content-block')[1];
      const goalsStyle = window.getComputedStyle(goals);
      const specsStyle = window.getComputedStyle(specs);
      const resultsStyle = window.getComputedStyle(results);

      return {
        scrollY: window.scrollY,
        goals: {
          opacity: goalsStyle.opacity,
          visibility: goalsStyle.visibility,
          transform: goalsStyle.transform,
          rect: goals.getBoundingClientRect()
        },
        specs: {
          opacity: specsStyle.opacity,
          visibility: specsStyle.visibility,
          transform: specsStyle.transform,
          rect: specs.getBoundingClientRect()
        },
        results: {
          opacity: resultsStyle.opacity,
          transform: resultsStyle.transform,
          inView: results.classList.contains('is-in-view')
        }
      };
    })()`,
    returnByValue: true
  });

  console.log('ON RELOAD STATE (scrollY = 0):', JSON.stringify(reloadState.result?.result?.value, null, 2));

  // Capture screenshot on reload (should show full goals and specs side by side, NOT blank!)
  const shotReload = await sendSession('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 800, scale: 1 }
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_reload_not_blank.png'), Buffer.from(shotReload.result.data, 'base64'));

  // STEP 3: Scroll down 260px (smooth scroll into Project Results)
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo({ top: 260, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  // Wait 1.3s for smooth 1.25s animation to settle
  await new Promise(r => setTimeout(r, 1350));

  const scrollState = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const results = document.querySelectorAll('.project-content-block')[1];
      const gallery = document.querySelector('#proj-gallery-wrap');
      const resultsStyle = window.getComputedStyle(results);
      return {
        scrollY: window.scrollY,
        results: {
          opacity: resultsStyle.opacity,
          transform: resultsStyle.transform,
          inView: results.classList.contains('is-in-view'),
          rect: results.getBoundingClientRect()
        }
      };
    })()`,
    returnByValue: true
  });

  console.log('ON SCROLL STATE (scrollY = 260):', JSON.stringify(scrollState.result?.result?.value, null, 2));

  // Capture screenshot scrolled (showing Project Results smoothly in view)
  const shotScrolled = await sendSession('Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 1440, height: 800, scale: 1 }
  });
  fs.writeFileSync(path.join(artifactDir, 'verified_scroll_smooth_revealed.png'), Buffer.from(shotScrolled.result.data, 'base64'));

  ws.close();
  chrome.kill();
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}

