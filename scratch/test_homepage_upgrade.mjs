import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_profile_upgrade_test';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9225/json/version');
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

  const viewports = [
    { name: 'desktop_1920x1080', width: 1920, height: 1080, mobile: false },
    { name: 'laptop_1366x768', width: 1366, height: 768, mobile: false },
    { name: 'tablet_768x1024', width: 768, height: 1024, mobile: false },
    { name: 'mobile_375x812', width: 375, height: 812, mobile: true }
  ];

  console.log('--- STARTING HOMEPAGE TESTS ---');

  for (const vp of viewports) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });

    await sendSession('Page.navigate', { url: 'http://localhost:3000/index.html' });
    await new Promise(r => setTimeout(r, 2200));

    const checkRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.getElementById('hero-section');
        const marquee = document.querySelector('.tech-marquee-wrapper');
        const heroRect = hero ? hero.getBoundingClientRect() : null;
        const marqueeRect = marquee ? marquee.getBoundingClientRect() : null;
        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

        // Check marquee logos
        const logos = Array.from(document.querySelectorAll('.tech-marquee-group:first-child .marquee-logo-item img'));
        const logoInfos = logos.map(img => ({
          alt: img.alt || 'no-alt',
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
          renderW: img.offsetWidth,
          renderH: img.offsetHeight
        }));

        return JSON.stringify({
          viewport: { width: window.innerWidth, height: window.innerHeight },
          scrollWidth: document.documentElement.scrollWidth,
          hasHorizontalOverflow,
          heroRect: heroRect ? { top: Math.round(heroRect.top), bottom: Math.round(heroRect.bottom), height: Math.round(heroRect.height) } : null,
          marqueeRect: marqueeRect ? { top: Math.round(marqueeRect.top), bottom: Math.round(marqueeRect.bottom), height: Math.round(marqueeRect.height) } : null,
          marqueeFitsAboveFold: marqueeRect ? (marqueeRect.bottom <= window.innerHeight) : false,
          totalLogosInFirstGroup: logos.length,
          firstGroupLogos: logoInfos.slice(0, 9)
        });
      })()`,
      returnByValue: true
    });

    console.log(`\n=== Viewport: ${vp.name} ===`);
    console.log(checkRes.result.result.value);

    // Initial viewport screenshot
    const shotRes = await sendSession('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: vp.width, height: vp.height, scale: 1 }
    });
    fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\pass1_${vp.name}_fold.png`, Buffer.from(shotRes.result.data, 'base64'));
  }

  // Portfolio page check
  console.log('\n--- TESTING PORTFOLIO PAGE ---');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendSession('Page.navigate', { url: 'http://localhost:3000/portfolio.html' });
  await new Promise(r => setTimeout(r, 2000));

  const portRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.portfolio-card'));
      return JSON.stringify({
        portfolioCardCount: cards.length,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      });
    })()`,
    returnByValue: true
  });
  console.log(portRes.result.result.value);

  const portShot = await sendSession('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1366, height: 768, scale: 1 }
  });
  fs.writeFileSync(`C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ac1bef05-1779-4e60-8ac7-dd7348616d3a\\pass1_portfolio_1366.png`, Buffer.from(portShot.result.data, 'base64'));

  ws.close();
} catch (err) {
  console.error(err);
} finally {
  chrome.kill();
  process.exit(0);
}
