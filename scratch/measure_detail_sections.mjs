import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9487',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_measure_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const targets = await fetch('http://127.0.0.1:9487/json/list').then(r => r.json());
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const filePath = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 1500));

  const sectionsData = await send('Runtime.evaluate', {
    expression: `
      Array.from(document.querySelectorAll('header, nav, section, footer')).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: el.className,
          id: el.id,
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
          computedPadding: window.getComputedStyle(el).padding,
          computedMargin: window.getComputedStyle(el).margin
        };
      })
    `,
    returnByValue: true
  });

  console.log('--- SECTIONS MEASUREMENT ---');
  for (const s of sectionsData.result.value) {
    console.log(`${s.tag}.${s.className} -> Top: ${s.top}px, Height: ${s.height}px, Padding: ${s.computedPadding}`);
  }

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

