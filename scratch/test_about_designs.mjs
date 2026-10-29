import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_about_designs_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9249',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9249/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Test 1: Full-width ribbon frame framing the top and bottom
  // approach-ribbon-bg.jpg has the 4-corner frame!
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const rib = document.querySelector('.page-ribbon-bg-img');
      rib.src = 'assets/approach-ribbon-bg.jpg';
      rib.style.position = 'absolute';
      rib.style.top = '50%';
      rib.style.left = '50%';
      rib.style.transform = 'translate(-50%, -50%)';
      rib.style.width = '100%';
      rib.style.maxWidth = '1500px';
      rib.style.height = '100%';
      rib.style.maxHeight = '92%';
      rib.style.objectFit = 'contain';
      rib.style.objectPosition = 'center center';
      rib.style.opacity = '0.9';
      rib.style.mixBlendMode = 'multiply';
      rib.style.maskImage = 'none';
      rib.style.webkitMaskImage = 'none';

      const main = document.querySelector('.page-main');
      main.style.padding = '4.5rem 0 5.5rem';
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const shot1 = await sendSession('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\about_test_contain_frame.png', Buffer.from(shot1.result.data, 'base64'));

  // Test 2: Using the bottom ribbon like team section
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const rib = document.querySelector('.page-ribbon-bg-img');
      rib.src = 'assets/team-ribbon-bottom.jpg';
      rib.style.position = 'absolute';
      rib.style.top = 'auto';
      rib.style.bottom = '0';
      rib.style.left = '50%';
      rib.style.transform = 'translateX(-50%)';
      rib.style.width = '100%';
      rib.style.maxWidth = 'min(1560px, 100vw)';
      rib.style.height = 'auto';
      rib.style.maxHeight = '120px';
      rib.style.objectFit = 'contain';
      rib.style.objectPosition = 'center bottom';
      rib.style.opacity = '0.9';
      rib.style.mixBlendMode = 'multiply';
      rib.style.maskImage = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 30%, black 100%)';
      rib.style.webkitMaskImage = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, black 30%, black 100%)';

      const main = document.querySelector('.page-main');
      main.style.padding = '4.5rem 0 8.5rem';
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const shot2 = await sendSession('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\about_test_bottom_ribbon.png', Buffer.from(shot2.result.data, 'base64'));

  console.log('Saved test designs');
  ws.close();
} catch (err) {
  console.error('Error:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
