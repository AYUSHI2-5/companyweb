import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_mega_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9449',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9449/json/version');
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
  await sendSession('Input.enable');

  // 1. Desktop Test (1440x900)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Hover over the portfolio nav item
  let evalHover = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const item = document.querySelector('.nav-item-has-dropdown');
      const link = document.querySelector('#nav-portfolio-link');
      const menu = document.querySelector('.portfolio-mega-menu');
      if (item) {
        item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      }
      return {
        itemFound: !!item,
        linkFound: !!link,
        menuFound: !!menu,
        menuClasses: menu ? menu.className : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Hover trigger evaluation:', evalHover.result.value);

  await new Promise(r => setTimeout(r, 500));

  let menuInfo = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const menu = document.querySelector('.portfolio-mega-menu');
      const cards = Array.from(document.querySelectorAll('.mega-menu-card'));
      const rect = menu ? menu.getBoundingClientRect() : null;
      const computed = menu ? window.getComputedStyle(menu) : null;
      
      const cardsData = cards.map(c => {
        const title = c.querySelector('.mega-card-title')?.innerText?.trim();
        const img = c.querySelector('.mega-card-img');
        const divider = c.querySelector('.mega-card-divider');
        const href = c.getAttribute('href');
        return {
          title,
          href,
          imgSrc: img ? img.src : null,
          imgNaturalWidth: img ? img.naturalWidth : null,
          hasDivider: !!divider
        };
      });

      return {
        visible: computed ? (computed.visibility === 'visible' && parseFloat(computed.opacity) > 0.8) : false,
        opacity: computed ? computed.opacity : null,
        transform: computed ? computed.transform : null,
        top: rect ? rect.top : null,
        left: rect ? rect.left : null,
        width: rect ? rect.width : null,
        height: rect ? rect.height : null,
        cardCount: cards.length,
        cards: cardsData
      };
    })()`,
    returnByValue: true
  });
  console.log('Menu Info:', JSON.stringify(menuInfo.result.value, null, 2));

  // Capture desktop screenshot with open mega menu
  let ssDesktop = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mega_menu_desktop.png', Buffer.from(ssDesktop.result.data, 'base64'));
  console.log('Saved scratch/mega_menu_desktop.png');

  // Test hover on card 1 to inspect zoom and divider
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.mega-menu-card');
      if (card) card.classList.add('hover-test');
    })()`
  });

  // 2. Test Mobile View (390x844)
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));

  // Open mobile menu toggle
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('#nav-toggle');
      if (toggle) toggle.checked = true;
      const link = document.querySelector('#nav-portfolio-link');
      if (link) link.click(); // trigger mobile accordion
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  let ssMobile = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mega_menu_mobile.png', Buffer.from(ssMobile.result.data, 'base64'));
  console.log('Saved scratch/mega_menu_mobile.png');

  ws.close();
  chrome.kill();
}

run().catch(e => {
  console.error(e);
  chrome.kill();
});
