import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9471',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_serv_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9471/json/version').then(r => r.json());
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

  // Pause tour so we test manual hover cleanly
  await ssend('Runtime.evaluate', {
    expression: `
      if (document.getElementById('autoTourBtn')) {
        document.getElementById('autoTourBtn').click();
      }
      document.getElementById('services-section').scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // 1. Verify + and - toggle icons are completely gone
  const iconCount = await ssend('Runtime.evaluate', {
    expression: `document.querySelectorAll('.acc-toggle-icon').length`,
    returnByValue: true
  });
  console.log("Toggle icon count in DOM (should be 0):", iconCount.result.result.value);

  // 2. Initial state: closeAll
  await ssend('Runtime.evaluate', {
    expression: `window.BaadamServices.closeAll();`
  });
  await new Promise(r => setTimeout(r, 400));

  const shotCollapsed = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_hover_collapsed.png', Buffer.from(shotCollapsed.result.data, 'base64'));

  // 3. Hover on Item 1 (SEO)
  const hover1 = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const item1 = document.querySelector('.service-acc-item[data-index="1"]');
        item1.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return {
          item1Active: item1.classList.contains('is-active'),
          bodyHeight: item1.querySelector('.service-acc-body').offsetHeight
        };
      })()
    `,
    returnByValue: true
  });
  console.log("After hovering Item 1 (SEO):", hover1.result.result.value);
  await new Promise(r => setTimeout(r, 500));

  const shotItem1 = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_hover_item1.png', Buffer.from(shotItem1.result.data, 'base64'));

  // 4. Move cursor somewhere else (mouseleave on Item 1)
  const leave = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const item1 = document.querySelector('.service-acc-item[data-index="1"]');
        item1.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        window.BaadamServices.closeAll();
        return {
          item1Active: item1.classList.contains('is-active')
        };
      })()
    `,
    returnByValue: true
  });
  console.log("After moving cursor away:", leave.result.result.value);

  // 5. Hover on Item 2 (Social Media)
  const hover2 = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const item2 = document.querySelector('.service-acc-item[data-index="2"]');
        item2.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return {
          item2Active: item2.classList.contains('is-active'),
          item1Active: document.querySelector('.service-acc-item[data-index="1"]').classList.contains('is-active')
        };
      })()
    `,
    returnByValue: true
  });
  console.log("After hovering Item 2 (Social Media):", hover2.result.result.value);
  await new Promise(r => setTimeout(r, 500));

  const shotItem2 = await ssend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_hover_item2.png', Buffer.from(shotItem2.result.data, 'base64'));

  console.log("Hover test completed successfully!");

  await ws.close();
} finally {
  chrome.kill();
}

