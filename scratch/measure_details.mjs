import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9470',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_det_' + Date.now(),
  'about:blank'
]);
await new Promise(r => setTimeout(r, 2000));
try {
  const v = await fetch('http://127.0.0.1:9470/json/version').then(r => r.json());
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

  const res = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const servChildren = Array.from(document.querySelector("#services-section .section-container").children).map(c => ({
          class: c.className,
          h: c.offsetHeight
        }));
        const accItems = Array.from(document.querySelectorAll(".service-acc-item")).map((it, i) => ({
          i,
          class: it.className,
          h: it.offsetHeight
        }));
        const caseChildren = Array.from(document.querySelector("#case-studies-section .section-container").children).map(c => ({
          class: c.className,
          h: c.offsetHeight
        }));
        const funnelChildren = Array.from(document.querySelector("#funnel-section .section-container").children).map(c => ({
          class: c.className,
          h: c.offsetHeight
        }));
        return { servChildren, accItems, caseChildren, funnelChildren };
      })()
    `,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.result.value, null, 2));

  await ws.close();
} finally {
  chrome.kill();
}
