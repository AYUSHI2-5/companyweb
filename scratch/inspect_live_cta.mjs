import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_inspect_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9447',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9447/json/version');
  let version = await versionRes.json();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

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
  let session = await send('Target.attachToTarget', { targetId: target.result.targetId, flatten: true });
  let sessionId = session.result.sessionId;
  function sendSession(method, params = {}) {
    return new Promise(resolve => {
      let curId = id++;
      callbacks.set(curId, resolve);
      ws.send(JSON.stringify({ id: curId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Runtime.enable');
  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 2000));

  let res = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const card = document.querySelector('.cta-banner-card');
      const btn = document.querySelector('.cta-banner-card a');
      const img = document.querySelector('.cta-banner-card img');
      return {
        hasCard: !!card,
        btnText: btn ? btn.innerText.trim() : null,
        btnClasses: btn ? btn.className : null,
        btnStyle: btn ? {
          background: window.getComputedStyle(btn).backgroundColor,
          color: window.getComputedStyle(btn).color,
          display: window.getComputedStyle(btn).display,
          padding: window.getComputedStyle(btn).padding,
          borderRadius: window.getComputedStyle(btn).borderRadius
        } : null,
        hasImage: !!img,
        imageVisible: img ? (img.offsetWidth > 0 && img.offsetHeight > 0) : false,
        imgSrc: img ? img.src : null
      };
    })())`
  });

  console.log('Result:', res.result.result.value);
  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
