import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_media_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9322',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9322/json/version');
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
  console.log('Logging in to admin...');
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

  // 2. Navigate to Media Library
  console.log('Navigating to http://localhost:8080/admin/media.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/media.html' });
  await new Promise(r => setTimeout(r, 3000));

  // Check how many images loaded and whether naturalWidth > 0
  const checkRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.media-card');
      const imgs = Array.from(document.querySelectorAll('.media-preview-box img'));
      const loadedImgs = imgs.filter(img => img.naturalWidth > 0);
      const brokenImgs = imgs.filter(img => img.naturalWidth === 0);
      return {
        cardCount: cards.length,
        imgCount: imgs.length,
        loadedCount: loadedImgs.length,
        brokenCount: brokenImgs.length,
        sampleLoadedSrcs: loadedImgs.slice(0, 3).map(i => i.src)
      };
    })()`,
    returnByValue: true
  });
  console.log('Media check result:', JSON.stringify(checkRes.result.value || checkRes.result, null, 2));

  // Capture Screenshot of Grid View
  const snapRes1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_media_library_grid.png', Buffer.from(snapRes1.result.data, 'base64'));
  console.log('Saved admin_media_library_grid.png');

  // Open first modal to inspect
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const firstCard = document.querySelector('.media-card');
      if (firstCard) {
        const previewBox = firstCard.querySelector('.media-preview-box');
        if (previewBox) previewBox.click();
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  // Capture Screenshot of Modal
  const snapRes2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_media_library_modal.png', Buffer.from(snapRes2.result.data, 'base64'));
  console.log('Saved admin_media_library_modal.png');

  // Close modal and switch to List View
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      closeModal();
      setViewMode('list');
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  // Capture Screenshot of List View
  const snapRes3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_media_library_list.png', Buffer.from(snapRes3.result.data, 'base64'));
  console.log('Saved admin_media_library_list.png');

  ws.close();
} catch (e) {
  console.error('CDP error:', e);
} finally {
  chrome.kill();
}
