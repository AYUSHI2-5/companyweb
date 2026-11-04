import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_case_study_' + Date.now();
const port = 9325;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
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
  const attachRes = await send('Target.attachToTarget', { targetId: targetRes.result.targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sessionSend(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  const errors = [];
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails.text);
    }
  });

  await sessionSend('Page.enable');
  await sessionSend('Runtime.enable');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1280,
    deviceScaleFactor: 1,
    mobile: false
  });

  const url = 'http://localhost:3000/index.html';
  console.log('Navigating to', url);
  await sessionSend('Page.navigate', { url });

  await new Promise(r => setTimeout(r, 2500));

  // Scroll to case-studies-section with offset to show full section
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('case-studies-section');
      if (sec) {
        const top = sec.getBoundingClientRect().top + window.pageYOffset - 40;
        window.scrollTo({ top, behavior: 'instant' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 1: Initial state (Northside Dental, 50% split)
  const snap1 = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_case_studies_01.png', Buffer.from(snap1.result.data, 'base64'));
  console.log('Captured scratch/snap_case_studies_01.png');

  // Test switching to tab 2: Kettlebrook Coffee
  await sessionSend('Runtime.evaluate', {
    expression: `
      const tab2 = document.querySelector('.case-tab[data-client="kettlebrook"]');
      if (tab2) tab2.click();
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 2: Switched to Kettlebrook Coffee
  const snap2 = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_case_studies_tab2.png', Buffer.from(snap2.result.data, 'base64'));
  console.log('Captured scratch/snap_case_studies_tab2.png');

  // Test slider drag interaction to 70%
  await sessionSend('Runtime.evaluate', {
    expression: `
      const card = document.getElementById('caseSliderCard');
      const handle = card.querySelector('.case-split-handle');
      const beforeLayer = card.querySelector('.case-layer-before');
      if (card && handle && beforeLayer) {
        beforeLayer.style.clipPath = 'inset(0 30% 0 0)';
        handle.style.left = '70%';
      }
    `
  });

  await new Promise(r => setTimeout(r, 500));

  // Screenshot 3: Slider dragged to 70%
  const snap3 = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_case_studies_dragged.png', Buffer.from(snap3.result.data, 'base64'));
  console.log('Captured scratch/snap_case_studies_dragged.png');

  console.log('Console errors found:', errors.length);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  }

  await ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
