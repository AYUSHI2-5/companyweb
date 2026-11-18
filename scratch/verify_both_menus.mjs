import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_both_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9455',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9455/json/version');
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
  await sendSession('Input.enable');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hover Services
  let posServ = JSON.parse((await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const r = document.querySelector('#nav-services-link').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })())`
  })).result.result.value);

  await sendSession('Input.dispatchMouseEvent', { type: 'mouseMoved', x: posServ.x, y: posServ.y });
  await new Promise(r => setTimeout(r, 500));

  let servOpen = JSON.parse((await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify({
      servicesOpen: document.querySelector('#nav-services-item').classList.contains('is-open'),
      portfolioOpen: document.querySelector('#nav-portfolio-item').classList.contains('is-open')
    })`
  })).result.result.value);
  console.log('Step 1 (Hover Services):', servOpen);

  // 2. Hover Portfolio
  let posPort = JSON.parse((await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const r = document.querySelector('#nav-portfolio-link').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })())`
  })).result.result.value);

  await sendSession('Input.dispatchMouseEvent', { type: 'mouseMoved', x: posPort.x, y: posPort.y });
  await new Promise(r => setTimeout(r, 500));

  let portOpen = JSON.parse((await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify({
      servicesOpen: document.querySelector('#nav-services-item').classList.contains('is-open'),
      portfolioOpen: document.querySelector('#nav-portfolio-item').classList.contains('is-open')
    })`
  })).result.result.value);
  console.log('Step 2 (Hover Portfolio):', portOpen);

  // 3. Move mouse away to body
  await sendSession('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 200, y: 500 });
  await new Promise(r => setTimeout(r, 500));

  let noneOpen = JSON.parse((await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify({
      servicesOpen: document.querySelector('#nav-services-item').classList.contains('is-open'),
      portfolioOpen: document.querySelector('#nav-portfolio-item').classList.contains('is-open')
    })`
  })).result.result.value);
  console.log('Step 3 (Move Away):', noneOpen);

  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
