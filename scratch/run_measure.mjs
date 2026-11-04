import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9499',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_meas2_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9499/json/version').then(r => r.json());
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
  await new Promise(r => setTimeout(r, 2500));

  await ssend('Runtime.evaluate', { expression: 'window.BaadamServices.open(0);' });
  await new Promise(r => setTimeout(r, 600));

  const info = await ssend('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.getElementById('services-section');
      const header = sec.querySelector('.services-header-split');
      const stack = sec.querySelector('.services-accordion-stack');
      const items = Array.from(sec.querySelectorAll('.service-acc-item'));
      const active = sec.querySelector('.service-acc-item.is-active');
      const activeBody = active ? active.querySelector('.service-acc-body') : null;
      const stepper = sec.querySelector('.services-stepper-bar');

      const data = {
        viewportHeight: window.innerHeight,
        secHeight: sec.offsetHeight,
        secBoundingHeight: sec.getBoundingClientRect().height,
        headerHeight: header ? header.offsetHeight : 0,
        stackHeight: stack ? stack.offsetHeight : 0,
        activeCardHeight: active ? active.offsetHeight : 0,
        activeBodyScrollHeight: activeBody ? activeBody.scrollHeight : 0,
        activeBodyMaxHeight: activeBody ? activeBody.style.maxHeight : 0,
        collapsedHeights: items.filter(it => !it.classList.contains('is-active')).map(it => it.offsetHeight),
        stepperHeight: stepper ? stepper.offsetHeight : 0,
        stepperMarginTop: stepper ? getComputedStyle(stepper).marginTop : 0,
        secPaddingTop: getComputedStyle(sec).paddingTop,
        secPaddingBottom: getComputedStyle(sec).paddingBottom
      };
      return JSON.stringify(data);
    })()`
  });
  console.log('MEASUREMENTS:', info.result.result.value);

  await ws.close();
} finally {
  chrome.kill();
}

