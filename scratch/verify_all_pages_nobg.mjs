import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_verify_all_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9257',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9257/json/version');
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
  await sendSession('Network.enable');
  await sendSession('Network.setCacheDisabled', { cacheDisabled: true });

  const pages = [
    { name: 'home_desktop', url: 'http://localhost:3000/index.html', width: 1440, height: 900, mobile: false },
    { name: 'home_mobile', url: 'http://localhost:3000/index.html', width: 390, height: 844, mobile: true },
    { name: 'about_desktop', url: 'http://localhost:3000/about.html', width: 1440, height: 900, mobile: false },
    { name: 'about_mobile', url: 'http://localhost:3000/about.html', width: 390, height: 844, mobile: true },
    { name: 'services_desktop', url: 'http://localhost:3000/services.html', width: 1440, height: 900, mobile: false },
    { name: 'contact_desktop', url: 'http://localhost:3000/contact.html', width: 1440, height: 900, mobile: false }
  ];

  for (const p of pages) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: p.width,
      height: p.height,
      deviceScaleFactor: p.mobile ? 2 : 1,
      mobile: p.mobile
    });

    await sendSession('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 1600));

    // Reveal scroll-animated sections
    await sendSession('Runtime.evaluate', {
      expression: `(() => {
        document.querySelectorAll('.scroll-animate, #hero-section, #about-section, #services-section, #approach-section, #team-section, #cta-section').forEach(el => {
          el.classList.add('is-visible');
        });
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify no background ribbon images are rendered
    const checkBgRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const bgImgs = Array.from(document.querySelectorAll('img')).filter(img => {
          const s = window.getComputedStyle(img);
          return s.display !== 'none' && (img.src.includes('ribbon') || img.className.includes('ribbon') || img.className.includes('bg-img'));
        });
        return bgImgs.length;
      })()`,
      returnByValue: true
    });

    console.log('[' + p.name + '] visible ribbon background images count: ' + checkBgRes.result.value);

    const shot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    fs.writeFileSync(
      'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\site_nobg_' + p.name + '.png',
      Buffer.from(shot.result.data, 'base64')
    );
  }

  console.log('Successfully captured all site_nobg screenshots');
  ws.close();
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  chrome.kill();
  process.exit(0);
}
