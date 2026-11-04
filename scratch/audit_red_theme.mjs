import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_red_theme_' + Date.now();
const port = 9340;

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

  await sessionSend('Page.enable');
  await sessionSend('Runtime.enable');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });

  const url = 'http://localhost:3000/index.html';
  console.log('Navigating to', url);
  await sessionSend('Page.navigate', { url });

  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture Hero Section (with red lens circle, red target blip, red badge, red highlight)
  const snapHero = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_01_hero.png', Buffer.from(snapHero.result.data, 'base64'));
  console.log('Captured scratch/snap_red_01_hero.png');

  // 2. Scroll to Radar section and capture
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('radar-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  await new Promise(r => setTimeout(r, 800));
  const snapRadar = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_02_radar.png', Buffer.from(snapRadar.result.data, 'base64'));
  console.log('Captured scratch/snap_red_02_radar.png');

  // 3. Scroll to Services section and capture
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.querySelector('.services-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  await new Promise(r => setTimeout(r, 800));
  const snapServices = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_03_services.png', Buffer.from(snapServices.result.data, 'base64'));
  console.log('Captured scratch/snap_red_03_services.png');

  // 4. Scroll to Case Studies section and capture
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.querySelector('.case-studies-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  await new Promise(r => setTimeout(r, 800));
  const snapCases = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_04_casestudies.png', Buffer.from(snapCases.result.data, 'base64'));
  console.log('Captured scratch/snap_red_04_casestudies.png');

  // 5. Scroll to Funnel section and capture
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.querySelector('.funnel-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  const snapFunnel = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_05_funnel.png', Buffer.from(snapFunnel.result.data, 'base64'));
  console.log('Captured scratch/snap_red_05_funnel.png');

  // 6. Scroll to CTA Banner & Footer and capture
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.querySelector('.cta-banner-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  const snapCta = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_06_cta_footer.png', Buffer.from(snapCta.result.data, 'base64'));
  console.log('Captured scratch/snap_red_06_cta_footer.png');

  // 7. Navigate to contact.html and capture
  await sessionSend('Page.navigate', { url: 'http://localhost:3000/contact.html' });
  await new Promise(r => setTimeout(r, 1500));
  const snapContact = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_red_07_contact.png', Buffer.from(snapContact.result.data, 'base64'));
  console.log('Captured scratch/snap_red_07_contact.png');

  await ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
