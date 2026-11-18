import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_desktop_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9451',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9451/json/version');
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
  await sendSession('Runtime.enable');

  // Set explicit 1440x900 viewport
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  let res = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const item = document.querySelector('.nav-item-has-dropdown');
      const menu = document.querySelector('.portfolio-mega-menu');
      const cards = Array.from(document.querySelectorAll('.mega-menu-card'));
      const trigger = document.querySelector('#nav-portfolio-link');

      // Trigger hover
      item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      const computed = menu ? window.getComputedStyle(menu) : null;
      const rect = menu ? menu.getBoundingClientRect() : null;

      return {
        viewportWidth: window.innerWidth,
        isOpenClass: item.classList.contains('is-open'),
        menuVisible: computed ? computed.visibility : null,
        menuOpacity: computed ? computed.opacity : null,
        menuTop: rect ? rect.top : null,
        menuLeft: rect ? rect.left : null,
        menuWidth: rect ? rect.width : null,
        cardCount: cards.length,
        cards: cards.map(c => ({
          title: c.querySelector('.mega-card-title')?.textContent.trim(),
          href: c.getAttribute('href'),
          imgSrc: c.querySelector('img')?.getAttribute('src'),
          imgWidth: c.querySelector('img')?.naturalWidth,
          imgHeight: c.querySelector('img')?.naturalHeight
        }))
      };
    })())`
  });

  console.log('EVAL RESULT:', res.result.result.value);

  // Take screenshot with open menu
  let screenshot = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mega_menu_open_verified.png', Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved scratch/mega_menu_open_verified.png');

  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
