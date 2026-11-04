import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_inspect_listeners_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9258',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9258/json/version');
  const versionData = await versionRes.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let id = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const targetRes = await send('Target.createTarget', { url: 'about:blank' });
  const targetId = targetRes.result.targetId;
  const attachRes = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOMDebugger.enable');

  await sendSession('Page.navigate', { url: `http://localhost:3000/about.html` });
  await new Promise(r => setTimeout(r, 2000));

  // Get window objectId
  const winObj = await sendSession('Runtime.evaluate', { expression: `window` });
  const winListeners = await sendSession('DOMDebugger.getEventListeners', {
    objectId: winObj.result.result.objectId
  });
  console.log('Window listeners:', JSON.stringify(winListeners.result.listeners.map(l => ({
    type: l.type,
    useCapture: l.useCapture,
    passive: l.passive,
    scriptId: l.scriptId,
    lineNumber: l.lineNumber
  })), null, 2));

  // Get document objectId
  const docObj = await sendSession('Runtime.evaluate', { expression: `document` });
  const docListeners = await sendSession('DOMDebugger.getEventListeners', {
    objectId: docObj.result.result.objectId
  });
  console.log('Document listeners:', JSON.stringify(docListeners.result.listeners.map(l => ({
    type: l.type,
    useCapture: l.useCapture,
    passive: l.passive,
    scriptId: l.scriptId,
    lineNumber: l.lineNumber
  })), null, 2));

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

