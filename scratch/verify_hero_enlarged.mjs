import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_hero_enlarged_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9264',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9264/json/version');
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

  // 1. Desktop (1440x900)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  const circleMetrics = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.hero-lens-circle');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        borderWidth: style.borderWidth,
        borderColor: style.borderColor,
        boxShadow: style.boxShadow
      };
    })()`,
    returnByValue: true
  });
  console.log('Desktop (1440x900) Circle Metrics:', circleMetrics.result.result.value);

  const desktopSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_enlarged_desktop.png', Buffer.from(desktopSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_hero_enlarged_desktop.png');

  // 2. Wide Desktop (1920x1080)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 800));

  const fhdMetrics = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.hero-lens-circle');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
    })()`,
    returnByValue: true
  });
  console.log('FHD (1920x1080) Circle Metrics:', fhdMetrics.result.result.value);

  const fhdSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_enlarged_fhd.png', Buffer.from(fhdSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_hero_enlarged_fhd.png');

  // 3. Tablet (1024x768)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 800));

  const tabletMetrics = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.hero-lens-circle');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
    })()`,
    returnByValue: true
  });
  console.log('Tablet (1024x768) Circle Metrics:', tabletMetrics.result.result.value);

  const tabletSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_enlarged_tablet.png', Buffer.from(tabletSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_hero_enlarged_tablet.png');

  // 4. Mobile (390x844)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileMetrics = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.hero-lens-circle');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
    })()`,
    returnByValue: true
  });
  console.log('Mobile (390x844) Circle Metrics:', mobileMetrics.result.result.value);

  const mobileSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_enlarged_mobile.png', Buffer.from(mobileSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_hero_enlarged_mobile.png');

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

