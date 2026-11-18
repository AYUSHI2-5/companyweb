import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9342',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\cdp_eval_val2',
  'about:blank'
], { stdio: 'ignore' });

setTimeout(async () => {
  try {
    const versionRes = await fetch('http://127.0.0.1:9342/json/version');
    const versionData = await versionRes.json();
    const ws = new WebSocket(versionData.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        let cur = id++;
        const handler = (evt) => {
          const d = JSON.parse(evt.data);
          if (d.id === cur) {
            ws.removeEventListener('message', handler);
            res(d);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: cur, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://localhost:8080/admin.html?edit=kp-e-services' });
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        return JSON.stringify({
          isModalOpen: document.getElementById('project-modal').classList.contains('active'),
          title: document.getElementById('field-title').value,
          category: document.getElementById('field-category').value,
          home: document.getElementById('radio-home-yes').checked,
          tagsCount: document.querySelectorAll('.tag-bubble').length,
          imgCount: document.querySelectorAll('.img-card-preview').length
        });
      })()`,
      returnByValue: true
    });

    console.log('EVAL RESULT:', evalRes.result.result.value);
    ws.close();
    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
