import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_adm_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9337',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9337/json/version');
  let version = await versionRes.json();
  let wsUrl = version.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

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
  let targetId = target.result.targetId;

  let session = await send('Target.attachToTarget', { targetId, flatten: true });
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

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const fileUrl = 'file:///C:/Users/Admin/Desktop/Baadam.com/admin.html';
  await sendSession('Page.navigate', { url: fileUrl });

  await new Promise(r => setTimeout(r, 2000));

  let checkRes = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const rows = document.querySelectorAll('#projects-table-body tr');
      const totalStat = document.getElementById('stat-total')?.textContent;
      const featuredStat = document.getElementById('stat-featured')?.textContent;
      
      // Test modal open
      const addBtn = document.getElementById('btn-create-project');
      addBtn.click();
      const modalActive = document.getElementById('project-modal')?.classList?.contains('active');
      
      // Test validation
      const fieldTitle = document.getElementById('field-title');
      fieldTitle.value = ''; // empty to trigger validation
      const saveBtn = document.getElementById('btn-save-project');
      saveBtn.click();
      
      const errorAlertVisible = document.getElementById('form-error-alert')?.style?.display !== 'none';
      const errorCount = document.querySelectorAll('#error-list li').length;

      return JSON.stringify({
        tableRowsCount: rows.length,
        totalStat,
        featuredStat,
        modalOpens: modalActive,
        validationCatchesErrors: errorAlertVisible,
        errorsDetected: errorCount
      });
    })()`
  });

  console.log('ADMIN DASHBOARD VERIFICATION:');
  console.log(JSON.stringify(JSON.parse(checkRes.result.result.value), null, 2));

  let screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/admin_dashboard.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/admin_dashboard.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});

