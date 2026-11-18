import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_audit_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9460',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2500));
  let versionRes = await fetch('http://127.0.0.1:9460/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Login
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  const loginData = await loginRes.json();

  await sendSession('Network.setCookie', {
    name: 'admin_session',
    value: loginData.token,
    domain: 'localhost',
    path: '/'
  });

  const pages = [
    { name: 'audit_dashboard', url: 'http://localhost:8080/admin/dashboard' },
    { name: 'audit_homepage_hub', url: 'http://localhost:8080/admin/homepage' },
    { name: 'audit_header', url: 'http://localhost:8080/admin/homepage/header' },
    { name: 'audit_hero', url: 'http://localhost:8080/admin/homepage/hero' },
    { name: 'audit_hp_services', url: 'http://localhost:8080/admin/homepage/services' },
    { name: 'audit_featured_work', url: 'http://localhost:8080/admin/homepage/featured-work' },
    { name: 'audit_case_studies', url: 'http://localhost:8080/admin/homepage/case-studies' },
    { name: 'audit_how_we_work', url: 'http://localhost:8080/admin/homepage/how-we-work' },
    { name: 'audit_next_steps', url: 'http://localhost:8080/admin/homepage/next-steps' },
    { name: 'audit_services_page', url: 'http://localhost:8080/admin/services' },
    { name: 'audit_projects_page', url: 'http://localhost:8080/admin/projects' },
    { name: 'audit_media_library', url: 'http://localhost:8080/admin/media' },
  ];

  for (const p of pages) {
    console.log(`Auditing ${p.name}: ${p.url}...`);
    await sendSession('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 1400));
    let shot = await sendSession('Page.captureScreenshot', { format: 'png' });
    const outPath = `C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\${p.name}.png`;
    fs.writeFileSync(outPath, Buffer.from(shot.result.data, 'base64'));
  }

  ws.close();
  chrome.kill();
  console.log('All admin page screenshots captured!');
}

run().catch(err => {
  console.error(err);
  try { chrome.kill(); } catch (e) {}
});

