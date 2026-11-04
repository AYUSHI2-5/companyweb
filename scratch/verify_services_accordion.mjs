import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_serv_acc_' + Date.now();
const port = 9319;

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
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false
  });

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  console.log('Navigating to', fileUrl);
  await sessionSend('Page.navigate', { url: fileUrl });

  await new Promise(r => setTimeout(r, 2200));

  // Scroll to services section
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('services-section');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });

  await new Promise(r => setTimeout(r, 800));

  // Screenshot item 01 active
  const snap1 = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_services_acc_01.png', Buffer.from(snap1.result.data, 'base64'));
  console.log('Captured scratch/snap_services_acc_01.png');

  // Click on item 04 (Content - lime pill)
  console.log('Clicking item 04 (Content)...');
  await sessionSend('Runtime.evaluate', {
    expression: `
      const item4Header = document.querySelector('.service-acc-item[data-index="4"] .service-acc-header');
      if (item4Header) item4Header.click();
    `
  });

  await new Promise(r => setTimeout(r, 800));

  // Check state
  const stateVal = await sessionSend('Runtime.evaluate', {
    expression: `
      (() => {
        const item4 = document.querySelector('.service-acc-item[data-index="4"]');
        const counter = document.querySelector('.acc-stepper-counter');
        const seg4 = document.querySelector('.acc-stepper-segment[data-step="4"]');
        return {
          item4Active: item4 ? item4.classList.contains('is-active') : false,
          counterText: counter ? counter.textContent.trim() : '',
          seg4Active: seg4 ? seg4.classList.contains('is-active') : false
        };
      })()
    `,
    returnByValue: true
  });
  console.log('State after clicking item 04:', stateVal.result.value);

  // Screenshot item 04 active
  const snap2 = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_services_acc_04.png', Buffer.from(snap2.result.data, 'base64'));
  console.log('Captured scratch/snap_services_acc_04.png');

  // Scroll down to show bottom stepper and items 5-6
  await sessionSend('Runtime.evaluate', {
    expression: `
      window.scrollBy({ top: 700, behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const snap3 = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_services_stepper.png', Buffer.from(snap3.result.data, 'base64'));
  console.log('Captured scratch/snap_services_stepper.png');

  console.log('Browser errors:', errors);

  ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
