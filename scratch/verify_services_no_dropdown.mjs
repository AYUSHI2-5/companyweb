import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_serv_nodrop_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9315',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9315/json/version');
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
  await sendSession('DOM.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Visit index.html
  console.log('Navigating to http://localhost:8080/index.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Check navbar DOM elements
  const checkNav = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const navItems = Array.from(document.querySelectorAll('.navbar-nav .nav-item')).map(el => ({
        text: el.innerText.trim(),
        hasDropdown: el.classList.contains('nav-item-has-dropdown'),
        id: el.id || '',
        html: el.innerHTML.slice(0, 150)
      }));
      const servicesMegaMenu = document.getElementById('services-mega-menu');
      const portfolioMegaMenu = document.getElementById('portfolio-mega-menu');
      return { navItems, hasServicesMega: !!servicesMegaMenu, hasPortMega: !!portfolioMegaMenu };
    })()`,
    returnByValue: true
  });
  console.log('Navbar check:', JSON.stringify(checkNav.result.value, null, 2));

  // Take screenshot of header / navbar on home page
  const snapRes1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\services_dropdown_removed_nav.png', Buffer.from(snapRes1.result.data, 'base64'));
  console.log('Saved services_dropdown_removed_nav.png');

  // 2. Visit services.html
  console.log('Navigating to http://localhost:8080/services.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/services.html' });
  await new Promise(r => setTimeout(r, 2000));

  const checkServices = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const servicesLink = document.querySelector('.navbar-nav a[href*="services.html"]');
      return {
        text: servicesLink ? servicesLink.textContent.trim() : null,
        className: servicesLink ? servicesLink.className : null,
        parentClass: servicesLink && servicesLink.parentElement ? servicesLink.parentElement.className : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Services page nav check:', JSON.stringify(checkServices.result.value, null, 2));

  const snapRes2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\services_page_nodropdown_nav.png', Buffer.from(snapRes2.result.data, 'base64'));
  console.log('Saved services_page_nodropdown_nav.png');

  // 3. Visit Admin homepage header editor
  console.log('Navigating to http://localhost:8080/admin/homepage/index.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/homepage/index.html' });
  await new Promise(r => setTimeout(r, 2500));

  const checkAdmin = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const hasServMegaCard = !!document.getElementById('hdr-serv-mega-container');
      const hasPortMegaCard = !!document.getElementById('hdr-port-mega-container');
      const cardTitles = Array.from(document.querySelectorAll('#panel-header .card-title')).map(el => el.textContent.trim());
      return { hasServMegaCard, hasPortMegaCard, cardTitles };
    })()`,
    returnByValue: true
  });
  console.log('Admin header check:', JSON.stringify(checkAdmin.result.value, null, 2));

  const snapRes3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\admin_header_no_services_dropdown.png', Buffer.from(snapRes3.result.data, 'base64'));
  console.log('Saved admin_header_no_services_dropdown.png');

  ws.close();
} catch (e) {
  console.error('CDP verification error:', e);
} finally {
  chrome.kill();
}
