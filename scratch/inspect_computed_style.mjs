import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9477',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_comp_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const targets = await fetch('http://127.0.0.1:9477/json/list').then(r => r.json());
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

  const styles = await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('.arch-schematic-card');
      const cs = window.getComputedStyle(el);
      ({
        background: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        width: el.clientWidth,
        height: el.clientHeight,
        rect: el.getBoundingClientRect()
      })
    `,
    returnByValue: true
  });
  console.log('Computed styles of .arch-schematic-card:', styles.result.value);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}

