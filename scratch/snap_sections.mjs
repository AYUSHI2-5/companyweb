import { spawn } from 'node:child_process';
import fs from 'node:fs';

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9455',
    '--disable-gpu',
    '--no-first-run',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_snap_' + Date.now(),
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const v = await fetch('http://127.0.0.1:9455/json/version').then(r => r.json());
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

    // Force all scroll reveals
    await ssend('Runtime.evaluate', {
      expression: 'document.querySelectorAll(".scroll-reveal").forEach(el => el.classList.add("is-revealed"));'
    });

    // 1. Services section
    await ssend('Runtime.evaluate', {
      expression: 'window.scrollTo(0, document.querySelector(".services-section").offsetTop - 60);'
    });
    await new Promise(r => setTimeout(r, 800));
    const servSnap = await ssend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/snap_serv_real.png', Buffer.from(servSnap.result.data, 'base64'));
    console.log('Saved scratch/snap_serv_real.png');

    // 2. Case studies section
    await ssend('Runtime.evaluate', {
      expression: 'window.scrollTo(0, document.querySelector(".case-studies-section").offsetTop - 60);'
    });
    await new Promise(r => setTimeout(r, 800));
    const caseSnap = await ssend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/snap_case_real.png', Buffer.from(caseSnap.result.data, 'base64'));
    console.log('Saved scratch/snap_case_real.png');

    // 3. CTA & Footer section
    await ssend('Runtime.evaluate', {
      expression: 'window.scrollTo(0, document.querySelector(".cta-banner-section").offsetTop - 40);'
    });
    await new Promise(r => setTimeout(r, 800));
    const ctaSnap = await ssend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/snap_cta_real.png', Buffer.from(ctaSnap.result.data, 'base64'));
    console.log('Saved scratch/snap_cta_real.png');

    // 4. Footer bottom
    await ssend('Runtime.evaluate', {
      expression: 'window.scrollTo(0, document.querySelector(".site-footer").offsetTop - 40);'
    });
    await new Promise(r => setTimeout(r, 800));
    const footerSnap = await ssend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/snap_footer_real.png', Buffer.from(footerSnap.result.data, 'base64'));
    console.log('Saved scratch/snap_footer_real.png');

    // 5. Portfolio page
    await ssend('Page.navigate', { url: 'http://localhost:3000/portfolio.html' });
    await new Promise(r => setTimeout(r, 1500));
    await ssend('Runtime.evaluate', {
      expression: 'document.querySelectorAll(".scroll-reveal").forEach(el => el.classList.add("is-revealed"));'
    });
    const portSnap = await ssend('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/snap_port_real.png', Buffer.from(portSnap.result.data, 'base64'));
    console.log('Saved scratch/snap_port_real.png');

    await ws.close();
  } finally {
    chrome.kill();
  }
}
test();

