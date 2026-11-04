import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9491',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_final_verify_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9491/json/version').then(r => r.json());
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const p = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); }
  };
  function send(method, params = {}) {
    return new Promise(r => { const i = id++; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  }

  const t = await send('Target.createTarget', { url: 'about:blank' });
  const a = await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true });
  const s = a.result.sessionId;
  function ssend(method, params = {}) {
    return new Promise(r => { const i = id++; p.set(i, r); ws.send(JSON.stringify({ id: i, sessionId: s, method, params })); });
  }

  await ssend('Page.enable');

  // 1. Desktop Test (1440x900)
  await ssend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await ssend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2500));

  const shotDesktopHero = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_01_desktop_hero.png', Buffer.from(shotDesktopHero.result.data, 'base64'));

  // Scroll down to Services
  await ssend('Runtime.evaluate', {
    expression: `
      document.querySelector('#services-section').scrollIntoView({ behavior: 'smooth' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const shotDesktopServices = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_02_desktop_services.png', Buffer.from(shotDesktopServices.result.data, 'base64'));

  // 2. Mobile Test (375x667)
  await ssend('Emulation.setDeviceMetricsOverride', { width: 375, height: 667, deviceScaleFactor: 2, mobile: true });
  await ssend('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 0, behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const shotMobileHero = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_03_mobile_hero.png', Buffer.from(shotMobileHero.result.data, 'base64'));

  console.log('Saved all desktop and mobile verification screenshots!');

  await ws.close();
} finally {
  chrome.kill();
}

