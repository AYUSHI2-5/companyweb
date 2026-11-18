import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_debug_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9459',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9459/json/version');
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
  await sendSession('Network.enable');

  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/login' });
  await new Promise(r => setTimeout(r, 1000));

  let loginResult = await sendSession('Runtime.evaluate', {
    expression: `(async () => {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
      });
      const data = await res.json();
      return data;
    })()`,
    awaitPromise: true
  });
  console.log('Login API returned:', loginResult.result.value);

  // Check cookies in browser
  let cookiesRes = await sendSession('Network.getCookies');
  console.log('Browser cookies:', cookiesRes.result.cookies);

  // Now navigate to dashboard
  console.log('Navigating to dashboard...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/dashboard.html' });
  await new Promise(r => setTimeout(r, 1500));

  let urlRes = await sendSession('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Final URL after navigating to dashboard:', urlRes.result.value);

  await send('Browser.close');
  chrome.kill();
}

run().catch(err => {
  console.error(err);
  chrome.kill();
});
