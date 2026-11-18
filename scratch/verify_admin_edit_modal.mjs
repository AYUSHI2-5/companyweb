import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_edit_modal_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9340',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9340/json/version');
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

  // 1. Check Project Detail Page "Manage in Admin" button href
  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/kp-e-services/' });
  await new Promise(r => setTimeout(r, 2000));

  let btnCheck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.getElementById('admin-edit-link');
      return {
        href: btn ? btn.href : null,
        text: btn ? btn.textContent.trim() : null,
        display: btn ? window.getComputedStyle(btn).display : null,
        borderRadius: btn ? window.getComputedStyle(btn).borderRadius : null
      };
    })()`
  });
  console.log('MANAGE BUTTON CHECK:');
  console.log(JSON.stringify(btnCheck.result.result.value, null, 2));

  // 2. Open admin.html with ?edit=kp-e-services
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin.html?edit=kp-e-services' });
  await new Promise(r => setTimeout(r, 2500));

  let adminCheck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.getElementById('project-modal');
      const isModalOpen = modal ? modal.classList.contains('active') : false;
      const modalTitle = document.getElementById('modal-heading')?.textContent?.trim();
      const titleVal = document.getElementById('field-title')?.value;
      const urlVal = document.getElementById('field-url')?.value;
      const catVal = document.getElementById('field-category')?.value;
      const homeVal = document.getElementById('radio-home-yes')?.checked;
      const monthVal = document.getElementById('field-month')?.value;
      const durVal = document.getElementById('field-duration')?.value;
      const descVal = document.getElementById('field-description')?.value;
      const tags = Array.from(document.querySelectorAll('.tag-bubble')).map(t => t.textContent.replace('×','').trim());
      const imgCount = document.querySelectorAll('.img-card-preview').length;
      
      const navContainer = document.querySelector('.nav-container');
      const navRadius = navContainer ? window.getComputedStyle(navContainer).borderRadius : null;

      return {
        isModalOpen,
        modalTitle,
        titleVal,
        urlVal,
        catVal,
        homeVal,
        monthVal,
        durVal,
        descValLength: descVal ? descVal.length : 0,
        tagsCount: tags.length,
        tagsSample: tags.slice(0, 3),
        imgCount,
        navPillRadius: navRadius
      };
    })()`
  });

  console.log('ADMIN EDIT AUTO-POPUP CHECK:');
  console.log(JSON.stringify(adminCheck.result.result.value, null, 2));

  // Take screenshot of the opened modal inside admin.html
  let modalScreenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/admin_edit_modal_perfect.png', Buffer.from(modalScreenshot.result.data, 'base64'));
  console.log('Saved scratch/admin_edit_modal_perfect.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});
