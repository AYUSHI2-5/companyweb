import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_debug_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9495',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9495/json/version');
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
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');
  await sendSession('Network.enable');

  ws.addEventListener('message', (event) => {
    let msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', msg.params.exceptionDetails);
    }
    if (msg.method === 'Network.responseReceived') {
      if (msg.params.response.url.includes('services')) {
        console.log('NETWORK:', msg.params.response.status, msg.params.response.url);
      }
    }
  });

  console.log('Navigating to http://localhost:8080/services.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services.html' });
  await new Promise(r => setTimeout(r, 3000));

  let htmlCheck = await sendSession('Runtime.evaluate', {
    expression: '({ heading: document.getElementById("services-main-heading")?.textContent, cardCount: document.querySelectorAll(".service-showcase-card").length, scripts: Array.from(document.querySelectorAll("script")).map(s => s.src) })',
    returnByValue: true
  });
  console.log('Page state:', htmlCheck.result?.value);

  ws.close();
  chrome.kill();
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (e) {}
});

