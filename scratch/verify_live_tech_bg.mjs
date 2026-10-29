import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_verify_tech_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9259',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9259/json/version');
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

  // Listen for console messages / errors
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[Console]', msg.params.type, msg.params.args.map(a => a.value));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[Exception]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception);
    }
  });

  // Test 1: Desktop Viewport on Homepage
  console.log('--- Testing Homepage (Desktop 1440x900) ---');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sessionSend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  // Check canvas elements
  const checkRes = await sessionSend('Runtime.evaluate', {
    expression: `(() => {
      const canvases = document.querySelectorAll('canvas.baadam-tech-canvas');
      const info = Array.from(canvases).map(c => {
        const parent = c.parentElement.className;
        return {
          parent,
          width: c.width,
          height: c.height,
          styleWidth: c.style.width,
          styleHeight: c.style.height
        };
      });
      return JSON.stringify({
        totalCanvases: canvases.length,
        canvases: info,
        heroBgWhite: window.getComputedStyle(document.body).backgroundColor
      });
    })()`,
    returnByValue: true
  });

  console.log('Homepage Tech Canvas Check:', JSON.parse(checkRes.result.result.value));

  // Capture Hero Section viewport screenshot
  const heroShot = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\tech_bg_home_hero.png', Buffer.from(heroShot.result.data, 'base64'));
  console.log('Saved hero screenshot: tech_bg_home_hero.png');

  // Scroll down to Services section
  await sessionSend('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => el.classList.add('is-visible'));
      const sec = document.querySelector('#services-section');
      if (sec) sec.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const servicesShot = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\tech_bg_home_services.png', Buffer.from(servicesShot.result.data, 'base64'));
  console.log('Saved services screenshot: tech_bg_home_services.png');

  // Test 2: About Us Page
  console.log('--- Testing About Page (Desktop 1440x900) ---');
  await sessionSend('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 1200));

  const aboutCheck = await sessionSend('Runtime.evaluate', {
    expression: `(() => {
      const canvases = document.querySelectorAll('canvas.baadam-tech-canvas');
      return JSON.stringify({
        totalCanvases: canvases.length,
        firstParent: canvases[0] ? canvases[0].parentElement.className : null
      });
    })()`,
    returnByValue: true
  });
  console.log('About Page Tech Canvas Check:', JSON.parse(aboutCheck.result.result.value));

  const aboutShot = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\tech_bg_about.png', Buffer.from(aboutShot.result.data, 'base64'));
  console.log('Saved about screenshot: tech_bg_about.png');

  // Test 3: Mobile Viewport on Homepage
  console.log('--- Testing Mobile Viewport (390x844) ---');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sessionSend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1200));

  const mobileShot = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\tech_bg_home_mobile.png', Buffer.from(mobileShot.result.data, 'base64'));
  console.log('Saved mobile screenshot: tech_bg_home_mobile.png');

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (err) {}
}
