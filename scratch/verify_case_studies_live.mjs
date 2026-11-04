import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_case_verify_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9263',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9263/json/version');
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

  // 1. Homepage Case Studies Section (1440x900)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('case-studies-section');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const homeCaseSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_index_case_studies.png', Buffer.from(homeCaseSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_index_case_studies.png');

  // Click Tab 3 (Mobile Application)
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const tabs = document.querySelectorAll('.case-tab');
      if (tabs.length >= 3) tabs[2].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const tab3Snap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_index_case_tab3.png', Buffer.from(tab3Snap.result.data, 'base64'));
  console.log('Saved scratch/snap_index_case_tab3.png');

  // 2. Portfolio Page Desktop (1440x900)
  await sendSession('Page.navigate', { url: 'http://localhost:3000/portfolio.html' });
  await new Promise(r => setTimeout(r, 1500));

  const portTopSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_portfolio_top.png', Buffer.from(portTopSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_portfolio_top.png');

  // Scroll down to cards grid
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo(0, 480);`
  });
  await new Promise(r => setTimeout(r, 600));

  const portCardsSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_portfolio_cards.png', Buffer.from(portCardsSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_portfolio_cards.png');

  // Scroll to bottom CTA
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo(0, document.documentElement.scrollHeight);`
  });
  await new Promise(r => setTimeout(r, 600));

  const portCtaSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_portfolio_cta.png', Buffer.from(portCtaSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_portfolio_cta.png');

  // 3. Mobile Viewport (390x844)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Runtime.evaluate', {
    expression: `window.scrollTo(0, 400);`
  });
  await new Promise(r => setTimeout(r, 600));

  const portMobileSnap = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_portfolio_mobile.png', Buffer.from(portMobileSnap.result.data, 'base64'));
  console.log('Saved scratch/snap_portfolio_mobile.png');

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

