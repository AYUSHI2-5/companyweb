import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9490',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cs_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9490/json/version').then(r => r.json());
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
        const sec = document.querySelector("#case-studies-section");
        const cont = sec.querySelector(".section-container");
        const comp = window.getComputedStyle(sec);
        const children = Array.from(cont.children).map(c => ({
          tag: c.tagName,
          class: c.className,
          h: c.offsetHeight,
          marginTop: window.getComputedStyle(c).marginTop,
          marginBottom: window.getComputedStyle(c).marginBottom
        }));
        return {
          secOffset: sec.offsetHeight,
          secScroll: sec.scrollHeight,
          secClient: sec.clientHeight,
          paddingTop: comp.paddingTop,
          paddingBottom: comp.paddingBottom,
          contHeight: cont.offsetHeight,
          contScroll: cont.scrollHeight,
          children
        };
      })()
    `,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.result.value, null, 2));

  await ws.close();
} finally {
  chrome.kill();
}

