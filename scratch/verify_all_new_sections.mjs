import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_verify_all_' + Date.now();
const port = 9330;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
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

  const errors = [];
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails.text);
    }
  });

  await sessionSend('Page.enable');
  await sessionSend('Runtime.enable');
  await sessionSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1280,
    deviceScaleFactor: 1,
    mobile: false
  });

  const url = 'http://localhost:3000/index.html';
  console.log('Navigating to', url);
  await sessionSend('Page.navigate', { url });

  await new Promise(r => setTimeout(r, 2500));

  // Verify section inventory
  const sectionsCheck = await sessionSend('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      ({
        hero: !!document.getElementById('hero-section'),
        radar: !!document.getElementById('radar-section'),
        aboutOld: !!document.getElementById('about-section'),
        statsOld: !!document.getElementById('stats-section'),
        services: !!document.getElementById('services-section'),
        caseStudies: !!document.getElementById('case-studies-section'),
        approachOld: !!document.getElementById('approach-section'),
        funnelNew: !!document.getElementById('funnel-section'),
        capabilitiesOld: !!document.getElementById('capabilities-section'),
        teamOld: !!document.getElementById('team-section'),
        cta: !!document.getElementById('cta-section')
      })
    `
  });
  console.log('Section inventory:', sectionsCheck.result.value);

  // 1. Capture Hero with Red/White theme
  const heroSnap = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_red.png', Buffer.from(heroSnap.result.data, 'base64'));
  console.log('Captured scratch/snap_hero_red.png');

  // 2. Scroll to and capture Case Studies with Red/White theme
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('case-studies-section');
      if (sec) {
        const top = sec.getBoundingClientRect().top + window.pageYOffset - 40;
        window.scrollTo({ top, behavior: 'instant' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const caseSnap = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_case_studies_red.png', Buffer.from(caseSnap.result.data, 'base64'));
  console.log('Captured scratch/snap_case_studies_red.png');

  // 3. Scroll to and capture NEW Funnel Section ((04) How we work)
  await sessionSend('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('funnel-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        sec.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      }
    `
  });
  // Wait for counter animation and progress bars animation to complete
  await new Promise(r => setTimeout(r, 1800));

  const funnelSnap = await sessionSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_funnel_section.png', Buffer.from(funnelSnap.result.data, 'base64'));
  console.log('Captured scratch/snap_funnel_section.png');

  // Check stat numbers and progress bar widths after animation
  const funnelValues = await sessionSend('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      Array.from(document.querySelectorAll('.funnel-card')).map(card => ({
        tag: card.querySelector('.funnel-pill-tag')?.textContent.trim(),
        stat: card.querySelector('.funnel-stat-num')?.textContent.trim(),
        barWidth: card.querySelector('.funnel-progress-bar')?.style.width,
        stepTitle: card.querySelector('.funnel-step-title')?.textContent.trim(),
        week: card.querySelector('.funnel-step-week-pill')?.textContent.trim()
      }))
    `
  });
  console.log('Funnel animated values:', funnelValues.result.value);

  console.log('Console errors found:', errors.length);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  }

  await ws.close();
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
