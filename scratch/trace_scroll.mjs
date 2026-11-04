import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_trace_scroll_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9252',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch('http://127.0.0.1:9252/json/version');
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

  // Intercept any scroll calls
  await sendSession('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__scrollLogs = [];
      const origScrollTo = window.scrollTo;
      window.scrollTo = function(...args) {
        window.__scrollLogs.push({ method: 'scrollTo', args, stack: new Error().stack });
        return origScrollTo.apply(this, args);
      };
      const origScrollIntoView = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function(...args) {
        window.__scrollLogs.push({ method: 'scrollIntoView', target: this.tagName + '.' + this.className + '#' + this.id, args, stack: new Error().stack });
        return origScrollIntoView.apply(this, args);
      };
      window.addEventListener('scroll', () => {
        window.__scrollLogs.push({ event: 'scroll', scrollY: window.scrollY });
      });
    `
  });

  await sendSession('Page.navigate', { url: 'http://localhost:3000/about.html' });
  await new Promise(r => setTimeout(r, 2000));

  const logsRes = await sendSession('Runtime.evaluate', {
    expression: `window.__scrollLogs`,
    returnByValue: true
  });
  console.log('Scroll Logs:', JSON.stringify(logsRes.result.result.value, null, 2));

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (_) {}
}

