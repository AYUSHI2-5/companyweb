import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--remote-debugging-port=9288', 'about:blank']);
await new Promise(r => setTimeout(r, 2000));
const v = await (await fetch('http://127.0.0.1:9288/json/version')).json();
const ws = new WebSocket(v.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 1;
const send = (method, params = {}) => new Promise(res => {
  const i = id++;
  const h = (e) => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); res(m); } };
  ws.addEventListener('message', h);
  ws.send(JSON.stringify({ id: i, method, params }));
});
const t = await send('Target.createTarget', { url: 'http://localhost:3000/index.html' });
const a = await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true });
const sid = a.result.sessionId;
const sess = (method, params = {}) => new Promise(res => {
  const i = id++;
  const h = (e) => { const m = JSON.parse(e.data); if (m.id === i) { ws.removeEventListener('message', h); res(m); } };
  ws.addEventListener('message', h);
  ws.send(JSON.stringify({ id: i, sessionId: sid, method, params }));
});
await new Promise(r => setTimeout(r, 1500));
const res = await sess('Runtime.evaluate', {
  expression: `(() => {
    return JSON.stringify(Array.from(document.querySelectorAll('canvas')).map(c => {
      const rect = c.getBoundingClientRect();
      return {
        className: c.className,
        parentClass: c.parentElement.className,
        parentId: c.parentElement.id,
        parentTag: c.parentElement.tagName,
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height, width: rect.width }
      };
    }), null, 2);
  })()`,
  returnByValue: true
});
console.log(res.result.result.value);
chrome.kill();
