import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_nav_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9338',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));

  let versionRes = await fetch('http://127.0.0.1:9338/json/version');
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

  // Desktop test: 1440x900
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const fileUrl = 'file:///C:/Users/Admin/Desktop/Baadam.com/projects/kp-e-services/index.html';
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 2000));

  let navCheck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('.site-header');
      const navContainer = document.querySelector('.nav-container');
      const activeLink = document.querySelector('.nav-link.active');
      const btnTalk = document.querySelector('.btn-talk');
      const hStyle = header ? window.getComputedStyle(header) : null;
      const cStyle = navContainer ? window.getComputedStyle(navContainer) : null;
      const aStyle = activeLink ? window.getComputedStyle(activeLink) : null;
      const bStyle = btnTalk ? window.getComputedStyle(btnTalk) : null;
      const title = document.getElementById('proj-field-title')?.textContent?.trim();

      return JSON.stringify({
        headerFound: !!header,
        headerPos: hStyle ? hStyle.position : null,
        navContainerFound: !!navContainer,
        navContainerDisplay: cStyle ? cStyle.display : null,
        navContainerBorderRadius: cStyle ? cStyle.borderRadius : null,
        navContainerBg: cStyle ? cStyle.backgroundColor : null,
        activeLinkText: activeLink ? activeLink.textContent.trim() : null,
        activeLinkColor: aStyle ? aStyle.color : null,
        activeLinkBg: aStyle ? aStyle.backgroundColor : null,
        btnTalkFound: !!btnTalk,
        btnTalkBg: bStyle ? bStyle.backgroundColor : null,
        projectTitle: title
      });
    })()`
  });

  console.log('DESKTOP NAVBAR CHECK:');
  console.log(JSON.stringify(JSON.parse(navCheck.result.result.value), null, 2));

  // Capture desktop screenshot
  let desktopScreenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/nav_fixed_desktop.png', Buffer.from(desktopScreenshot.result.data, 'base64'));
  console.log('Saved scratch/nav_fixed_desktop.png');

  // Mobile test: 390x844
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendSession('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 2000));

  let mobCheck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hamburger = document.querySelector('.nav-toggle-label');
      const hamVisible = hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false;

      return JSON.stringify({
        docWidth: docW,
        winWidth: winW,
        hasHorizontalOverflow: docW > winW,
        hamburgerVisible: hamVisible
      });
    })()`
  });

  console.log('MOBILE NAVBAR CHECK:');
  console.log(JSON.stringify(JSON.parse(mobCheck.result.result.value), null, 2));

  let mobScreenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/nav_fixed_mobile.png', Buffer.from(mobScreenshot.result.data, 'base64'));
  console.log('Saved scratch/nav_fixed_mobile.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error('Error:', e);
  chrome.kill();
});

