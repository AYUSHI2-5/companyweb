import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_sidebar_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9396',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9396/json/version');
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
      ws.send(JSON.stringify({ sessionId, id: msgId, method, params }));
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

  console.log('Navigating to http://localhost:8080/projects/ashray-labs/ ...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/ashray-labs/' });
  await new Promise(r => setTimeout(r, 2500));

  // Inspect sidebar dimensions
  const sidebarStats = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const sidebar = document.querySelector('.project-right-col');
        const cards = sidebar.querySelectorAll('.info-card');
        const goalsCard = document.querySelector('.project-goals-card');
        const sidebarRect = sidebar.getBoundingClientRect();
        const goalsRect = goalsCard ? goalsCard.getBoundingClientRect() : null;
        
        return {
          sidebarHeight: Math.round(sidebarRect.height),
          goalsCardHeight: goalsRect ? Math.round(goalsRect.height) : null,
          cards: Array.from(cards).map(c => {
            const r = c.getBoundingClientRect();
            return {
              heading: c.querySelector('.info-card-heading')?.textContent?.trim(),
              width: Math.round(r.width),
              height: Math.round(r.height),
              display: window.getComputedStyle(c).display
            };
          })
        };
      })()
    `
  });

  console.log('Sidebar stats:', JSON.stringify(sidebarStats.result?.result?.value, null, 2));

  const artDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

  // Screenshot top viewport
  const ssTop = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artDir, 'project_detail_compact_sidebar_top.png'), Buffer.from(ssTop.result.data, 'base64'));
  console.log('Saved: project_detail_compact_sidebar_top.png');

  // Scroll down slightly to see main image + full sidebar
  await sendSession('Runtime.evaluate', {
    expression: 'window.scrollBy(0, 250);'
  });
  await new Promise(r => setTimeout(r, 600));

  const ssMid = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artDir, 'project_detail_compact_sidebar_mid.png'), Buffer.from(ssMid.result.data, 'base64'));
  console.log('Saved: project_detail_compact_sidebar_mid.png');

  ws.close();
} catch (err) {
  console.error('Test error:', err);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}

