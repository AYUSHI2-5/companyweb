import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9468',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_tour_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9468/json/version').then(r => r.json());
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

  // Initial state (t = 1.5s)
  await new Promise(r => setTimeout(r, 1500));
  const state1 = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('autoTourBtn');
        const label = document.getElementById('tourBtnLabel');
        const fill = document.getElementById('tourProgressFill');
        return {
          t: '1.5s',
          scrollY: window.scrollY,
          label: label ? label.textContent : null,
          isPlaying: btn ? btn.classList.contains('is-playing') : false,
          progressWidth: fill ? fill.style.width : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log("State at 1.5s:", state1.result.result.value);

  // After first section duration (t = 5.2s, should have transitioned to radar)
  await new Promise(r => setTimeout(r, 3700));
  const state2 = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const label = document.getElementById('tourBtnLabel');
        const dotActive = document.querySelector('.snap-nav-dot.is-active');
        return {
          t: '5.2s',
          scrollY: window.scrollY,
          label: label ? label.textContent : null,
          activeDot: dotActive ? dotActive.getAttribute('data-section') : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log("State at 5.2s:", state2.result.result.value);

  // After second section duration (t = 10.2s, should have transitioned to services)
  await new Promise(r => setTimeout(r, 5000));
  const state3 = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const label = document.getElementById('tourBtnLabel');
        const dotActive = document.querySelector('.snap-nav-dot.is-active');
        return {
          t: '10.2s',
          scrollY: window.scrollY,
          label: label ? label.textContent : null,
          activeDot: dotActive ? dotActive.getAttribute('data-section') : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log("State at 10.2s:", state3.result.result.value);

  // Test Pause button click
  await ssend('Runtime.evaluate', {
    expression: `
      document.getElementById('autoTourBtn').click();
    `
  });
  await new Promise(r => setTimeout(r, 500));
  const pauseState = await ssend('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('autoTourBtn');
        const label = document.getElementById('tourBtnLabel');
        return {
          label: label ? label.textContent : null,
          isPlaying: btn ? btn.classList.contains('is-playing') : false
        };
      })()
    `,
    returnByValue: true
  });
  console.log("State after clicking Pause:", pauseState.result.result.value);

  await ws.close();
} finally {
  chrome.kill();
}

