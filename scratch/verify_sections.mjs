import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9475',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_snap_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9475/json/version').then(r => r.json());
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const p = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); }
  };
  function send(method, params = {}) {
    return new Promise(r => { const i = id++; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  }

  const t = await send('Target.createTarget', { url: 'about:blank' });
  const a = await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true });
  const s = a.result.sessionId;
  function ssend(method, params = {}) {
    return new Promise(r => { const i = id++; p.set(i, r); ws.send(JSON.stringify({ id: i, sessionId: s, method, params })); });
  }

  await ssend('Page.enable');
  await ssend('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await ssend('Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Measure sections
  const res = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const ids = [
          'hero-section',
          'radar-section',
          'services-section',
          'case-studies-section',
          'funnel-section',
          'cta-section',
          'site-footer'
        ];
        return ids.map(id => {
          const el = document.getElementById(id);
          if (!el) return { id, exists: false };
          const rect = el.getBoundingClientRect();
          return {
            id,
            offsetHeight: el.offsetHeight,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            rectHeight: rect.height
          };
        });
      })()
    `,
    returnByValue: true
  });

  console.log("Section Measurements (Viewport 1440x900):");
  console.log(JSON.stringify(res.result.result.value, null, 2));

  // Check dot navigation
  const dotRes = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const dots = Array.from(document.querySelectorAll('.snap-nav-dot'));
        return {
          dotCount: dots.length,
          activeCount: document.querySelectorAll('.snap-nav-dot.is-active').length,
          dots: dots.map(d => ({
            sec: d.getAttribute('data-section'),
            isActive: d.classList.contains('is-active')
          }))
        };
      })()
    `,
    returnByValue: true
  });
  console.log("Dot Navigation State:", JSON.stringify(dotRes.result.result.value, null, 2));

  // Capture screenshot of each section
  const sectionIds = [
    'hero-section',
    'radar-section',
    'services-section',
    'case-studies-section',
    'funnel-section',
    'cta-section',
    'site-footer'
  ];

  for (let i = 0; i < sectionIds.length; i++) {
    const secId = sectionIds[i];
    await ssend('Runtime.evaluate', {
      expression: `
        document.getElementById('${secId}').scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const shot = await ssend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/snap_sec_${i + 1}_${secId}.png`, Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved screenshot for ${secId} to scratch/snap_sec_${i + 1}_${secId}.png`);
  }

  await ws.close();
} finally {
  chrome.kill();
}

