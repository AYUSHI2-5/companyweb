import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9485',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_issues_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const targets = await fetch('http://127.0.0.1:9485/json/list').then(r => r.json());
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const filePath = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 1500));

  // Check images
  const imagesReport = await send('Runtime.evaluate', {
    expression: `
      Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.getAttribute('src'),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: img.clientWidth,
        renderedHeight: img.clientHeight,
        isBroken: img.naturalWidth === 0
      }))
    `,
    returnByValue: true
  });
  console.log('--- IMAGES STATUS ---');
  for (const img of imagesReport.result.value) {
    console.log(`${img.src} -> Broken: ${img.isBroken}, Nat: ${img.naturalWidth}x${img.naturalHeight}, Rendered: ${img.renderedWidth}x${img.renderedHeight}`);
  }

  // Check Architecture Diagram rendering
  const archReport = await send('Runtime.evaluate', {
    expression: `
      const card = document.querySelector('.arch-schematic-card');
      const tiers = document.querySelectorAll('.arch-tier-box');
      const nodes = document.querySelectorAll('.arch-node-pill');
      return {
        cardExists: !!card,
        cardWidth: card?.clientWidth,
        cardHeight: card?.clientHeight,
        tiersCount: tiers.length,
        nodesCount: nodes.length
      };
    `,
    returnByValue: true
  });
  console.log('\n--- ARCHITECTURE STATUS ---', archReport.result.value);

  // Capture specific key section viewports:
  // 1. Breadcrumb + Hero + Specs
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 400));
  let s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_01_hero.png', Buffer.from(s.data, 'base64'));

  // 2. Story / Challenge / Solution
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1450)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_02_story.png', Buffer.from(s.data, 'base64'));

  // 3. Features & Tech Matrix
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 2200)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_03_features.png', Buffer.from(s.data, 'base64'));

  // 4. Architecture
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 3800)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_04_arch.png', Buffer.from(s.data, 'base64'));

  // 5. Showcase
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 5100)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_05_showcase.png', Buffer.from(s.data, 'base64'));

  // 6. Contributions
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 5900)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_06_contrib.png', Buffer.from(s.data, 'base64'));

  // 7. Results & Links
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 7000)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_07_results.png', Buffer.from(s.data, 'base64'));

  // 8. Related Projects
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 8100)' });
  await new Promise(r => setTimeout(r, 400));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/inspect_08_related.png', Buffer.from(s.data, 'base64'));

  console.log('Saved key inspection screenshots');
  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

