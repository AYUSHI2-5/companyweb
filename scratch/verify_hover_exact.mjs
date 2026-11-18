import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_hover_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9452',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9452/json/version');
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
  await sendSession('Input.enable');

  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Get bounding box of #nav-portfolio-link
  let boxRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const link = document.querySelector('#nav-portfolio-link');
      if (!link) return null;
      const rect = link.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })())`
  });
  const pos = JSON.parse(boxRes.result.result.value);
  console.log('Portfolio link center:', pos);

  // Move real mouse cursor over Portfolio link
  await sendSession('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: pos.x,
    y: pos.y
  });

  await new Promise(r => setTimeout(r, 600));

  // Check mega menu visibility
  let stateRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const menu = document.querySelector('.portfolio-mega-menu');
      const item = document.querySelector('.nav-item-has-dropdown');
      const computed = menu ? window.getComputedStyle(menu) : null;
      const rect = menu ? menu.getBoundingClientRect() : null;
      const cards = Array.from(document.querySelectorAll('.mega-menu-card'));
      return {
        itemHovered: item.matches(':hover'),
        isOpen: item.classList.contains('is-open'),
        visibility: computed ? computed.visibility : null,
        opacity: computed ? computed.opacity : null,
        transform: computed ? computed.transform : null,
        rect: rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null,
        cards: cards.map(c => ({
          title: c.querySelector('.mega-card-title')?.textContent.trim(),
          imgSrc: c.querySelector('img')?.src,
          imgNaturalWidth: c.querySelector('img')?.naturalWidth
        }))
      };
    })())`
  });
  console.log('Open state:', stateRes.result.result.value);

  // Capture screenshot of desktop with mega menu fully open
  let ss = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mega_menu_real_hover.png', Buffer.from(ss.result.data, 'base64'));
  console.log('Saved scratch/mega_menu_real_hover.png');

  // Now hover over Card 1 ("Creative Design")
  let card1BoxRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const card = document.querySelector('.mega-menu-card');
      const rect = card.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })())`
  });
  const card1Pos = JSON.parse(card1BoxRes.result.result.value);

  await sendSession('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: card1Pos.x,
    y: card1Pos.y
  });
  await new Promise(r => setTimeout(r, 500));

  let cardHoverInfo = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const card = document.querySelector('.mega-menu-card');
      const title = card.querySelector('.mega-card-title');
      const img = card.querySelector('.mega-card-img');
      const tStyle = window.getComputedStyle(title);
      const iStyle = window.getComputedStyle(img);
      return {
        cardHovered: card.matches(':hover'),
        titleColor: tStyle.color,
        imgTransform: iStyle.transform
      };
    })())`
  });
  console.log('Card 1 hover effect:', cardHoverInfo.result.result.value);

  let ssCardHover = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mega_menu_card_hover.png', Buffer.from(ssCardHover.result.data, 'base64'));
  console.log('Saved scratch/mega_menu_card_hover.png');

  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
