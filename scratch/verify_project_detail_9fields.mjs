import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_9f_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9336',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9336/json/version');
  let version = await versionRes.json();
  let wsUrl = version.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    let msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise(resolve => {
      let curId = id++;
      callbacks.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  let target = await send('Target.createTarget', { url: 'about:blank' });
  let targetId = target.result.targetId;

  let session = await send('Target.attachToTarget', { targetId, flatten: true });
  let sessionId = session.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      let curId = id++;
      callbacks.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Test projects/kp-e-services/index.html
  const fileUrl = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await sendSession('Page.navigate', { url: fileUrl });

  await new Promise(r => setTimeout(r, 2500));

  let checkRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const title = document.getElementById('proj-field-title')?.textContent?.trim();
      const url = document.getElementById('proj-field-url')?.href;
      const category = document.getElementById('proj-field-category')?.textContent?.trim();
      const homeIndicator = document.getElementById('proj-field-home-indicator')?.textContent?.trim();
      const month = document.getElementById('proj-field-month')?.textContent?.trim();
      const duration = document.getElementById('proj-field-duration')?.textContent?.trim();
      const techBadges = Array.from(document.querySelectorAll('#proj-field-technologies .tech-badge-item')).map(el => el.textContent.trim());
      const description = document.getElementById('proj-field-description')?.textContent?.trim();
      const galleryCards = document.querySelectorAll('#proj-field-gallery .gallery-item-card');

      // Check no disallowed sections
      const hasKeyFeatures = !!document.querySelector('.key-features-section, [id*="key-features"]');
      const hasTechStack = !!document.querySelector('.tech-stack-matrix, [id*="tech-matrix"]');
      const hasArchitecture = !!document.querySelector('.architecture-section, [id*="architecture"]');
      const hasShowcase = !!document.querySelector('.application-showcase-section');
      const hasContributions = !!document.querySelector('.contributions-section');
      const hasResultsImpact = !!document.querySelector('.results-impact-section');

      // Test Lightbox trigger
      let lightboxOpenedBefore = document.getElementById('lightbox-modal')?.classList?.contains('active');
      if (galleryCards.length > 0) {
        galleryCards[0].click();
      }
      let lightboxOpenedAfter = document.getElementById('lightbox-modal')?.classList?.contains('active');
      let lightboxSrc = document.getElementById('lightbox-img')?.src;

      return JSON.stringify({
        field1_title: title,
        field2_url: url,
        field3_category: category,
        field4_home_indicator: homeIndicator,
        field5_month: month,
        field6_duration: duration,
        field7_tech_count: techBadges.length,
        field7_sample_tech: techBadges.slice(0, 3),
        field8_desc_length: description ? description.length : 0,
        field9_gallery_count: galleryCards.length,
        lightbox_works: !lightboxOpenedBefore && lightboxOpenedAfter,
        lightbox_src: lightboxSrc,
        extra_sections_present: hasKeyFeatures || hasTechStack || hasArchitecture || hasShowcase || hasContributions || hasResultsImpact
      });
    })()`
  });

  console.log('9-FIELD VERIFICATION RESULT:');
  console.log(JSON.stringify(JSON.parse(checkRes.result.result.value), null, 2));

  // Take screenshot of hero and fields
  let screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_9fields_hero.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/verify_9fields_hero.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});

