import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_hp_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9323',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9323/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Log in
  console.log('Logging into admin...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/login.html' });
  await new Promise(r => setTimeout(r, 1200));

  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('username').value = 'admin';
      document.getElementById('password').value = 'Baadam@2026';
      document.getElementById('submit-btn').click();
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Navigate to Homepage Management
  console.log('Navigating to http://localhost:8080/admin/homepage/index.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/index.html' });
  await new Promise(r => setTimeout(r, 3000));

  // Capture Tab 1: Header & Nav
  console.log('Capturing Tab 01: Header & Nav...');
  const snap1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\homepage_admin_tab1_header.png`, Buffer.from(snap1.result.data, 'base64'));

  // Switch to Tab 3: Radar
  console.log('Switching to Tab 03: Radar...');
  await sendSession('Runtime.evaluate', {
    expression: `switchSectionTab('radar')`
  });
  await new Promise(r => setTimeout(r, 1000));
  const snap3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\homepage_admin_tab3_radar.png`, Buffer.from(snap3.result.data, 'base64'));

  // Switch to Tab 4: Services
  console.log('Switching to Tab 04: Services (6 Cards)...');
  await sendSession('Runtime.evaluate', {
    expression: `switchSectionTab('services')`
  });
  await new Promise(r => setTimeout(r, 1000));
  const snap4 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\homepage_admin_tab4_services.png`, Buffer.from(snap4.result.data, 'base64'));

  // Switch to Tab 7: How We Work
  console.log('Switching to Tab 07: How We Work (Funnel)...');
  await sendSession('Runtime.evaluate', {
    expression: `switchSectionTab('how_we_work')`
  });
  await new Promise(r => setTimeout(r, 1000));
  const snap7 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\homepage_admin_tab7_funnel.png`, Buffer.from(snap7.result.data, 'base64'));

  // Switch to Tab 10: Overview Hub
  console.log('Switching to Tab 10: Sections Overview Hub...');
  await sendSession('Runtime.evaluate', {
    expression: `switchSectionTab('overview')`
  });
  await new Promise(r => setTimeout(r, 1000));
  const snap10 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\homepage_admin_tab10_hub.png`, Buffer.from(snap10.result.data, 'base64'));

  // Test Editing and Publishing:
  // Switch back to Hero, edit kicker to "Now booking Q4 · 2 spots left", click Publish Section
  console.log('Testing live edit & publish on Hero section...');
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      switchSectionTab('hero');
      document.getElementById('hero_kicker').value = 'Now booking Q4 · 2 spots left';
      saveSection('hero', true);
    })()`
  });
  await new Promise(r => setTimeout(r, 2500));

  // Navigate to live Homepage
  console.log('Navigating to live Homepage http://localhost:8080/ ...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 3000));

  // Check if live homepage reflects the update
  const verifyRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const topBadge = document.querySelector('.hero-top-badge span:last-child');
      const headline = document.querySelector('.hero-lens-headline');
      const radar = document.querySelector('.radar-headline');
      return {
        topBadgeText: topBadge ? topBadge.textContent : null,
        headlineText: headline ? headline.textContent.trim().replace(/\\s+/g, ' ') : null,
        radarHeadline: radar ? radar.textContent.trim().replace(/\\s+/g, ' ') : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Live Homepage verification:', JSON.stringify(verifyRes.result.value || verifyRes.result, null, 2));

  // Capture Live Homepage Screenshot
  const snapLive = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}\\homepage_live_ssr_verified.png`, Buffer.from(snapLive.result.data, 'base64'));
  console.log('Saved homepage_live_ssr_verified.png');

  ws.close();
} catch (e) {
  console.error('CDP verification error:', e);
} finally {
  chrome.kill();
}

