import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_feat_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9394',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9394/json/version');
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

  // 1. SSR test for non-homepage project (procurve)
  console.log('Testing ProCurve (SSR)...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/procurve/' });
  await new Promise(r => setTimeout(r, 1500));
  const procFeat = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('proj-field-featured');
      const bar = document.querySelector('.banner-badge-bar');
      return {
        elDisplay: el ? window.getComputedStyle(el).display : 'missing',
        barDisplay: bar ? window.getComputedStyle(bar).display : 'missing',
        visible: el && window.getComputedStyle(el).display !== 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('ProCurve Featured Visible:', procFeat.result.result ? procFeat.result.result.value : procFeat);

  // 2. SSR test for homepage project (kp-e-services)
  console.log('Testing KP E-Services (SSR)...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 1500));
  const kpFeat = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('proj-field-featured');
      const bar = document.querySelector('.banner-badge-bar');
      return {
        elDisplay: el ? window.getComputedStyle(el).display : 'missing',
        barDisplay: bar ? window.getComputedStyle(bar).display : 'missing',
        visible: el && window.getComputedStyle(el).display !== 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('KP E-Services Featured Visible:', kpFeat.result.result ? kpFeat.result.result.value : kpFeat);

  // 3. Client-side navigation test (/project-detail.html?slug=heart-foundation-and-research-institute)
  console.log('Testing Heart Foundation via client-side query param...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/project-detail.html?slug=heart-foundation-and-research-institute' });
  await new Promise(r => setTimeout(r, 1500));
  const heartFeat = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('proj-field-featured');
      const bar = document.querySelector('.banner-badge-bar');
      return {
        elDisplay: el ? window.getComputedStyle(el).display : 'missing',
        barDisplay: bar ? window.getComputedStyle(bar).display : 'missing',
        visible: el && window.getComputedStyle(el).display !== 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('Heart Foundation Featured Visible:', heartFeat.result.result ? heartFeat.result.result.value : heartFeat);

  // 4. Client-side navigation test (/project-detail.html?slug=chick-n-go)
  console.log('Testing Chick N Go via client-side query param...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/project-detail.html?slug=chick-n-go' });
  await new Promise(r => setTimeout(r, 1500));
  const chickFeat = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('proj-field-featured');
      const bar = document.querySelector('.banner-badge-bar');
      return {
        elDisplay: el ? window.getComputedStyle(el).display : 'missing',
        barDisplay: bar ? window.getComputedStyle(bar).display : 'missing',
        visible: el && window.getComputedStyle(el).display !== 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('Chick N Go Featured Visible:', chickFeat.result.result ? chickFeat.result.result.value : chickFeat);

  ws.close();
} catch (e) {
  console.error('Error during test:', e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}
