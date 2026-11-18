import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_services_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9454',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9454/json/version');
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

  // 1. Get position of #nav-services-link
  let posRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const link = document.querySelector('#nav-services-link');
      if (!link) return null;
      const rect = link.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })())`
  });
  const posServices = JSON.parse(posRes.result.result.value);
  console.log('Services link center:', posServices);

  // Move mouse over Services link
  await sendSession('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: posServices.x,
    y: posServices.y
  });
  await new Promise(r => setTimeout(r, 600));

  // Check services mega menu open state
  let servicesState = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const menu = document.querySelector('#services-mega-menu');
      const item = document.querySelector('#nav-services-item');
      const computed = menu ? window.getComputedStyle(menu) : null;
      const rect = menu ? menu.getBoundingClientRect() : null;
      const cards = Array.from(menu ? menu.querySelectorAll('.mega-menu-card') : []);
      return {
        itemHovered: item ? item.matches(':hover') : false,
        isOpen: item ? item.classList.contains('is-open') : false,
        visibility: computed ? computed.visibility : null,
        opacity: computed ? computed.opacity : null,
        top: rect ? rect.top : null,
        left: rect ? rect.left : null,
        width: rect ? rect.width : null,
        cardCount: cards.length,
        cards: cards.map(c => ({
          title: c.querySelector('.mega-card-title')?.textContent.trim(),
          href: c.getAttribute('href'),
          imgSrc: c.querySelector('img')?.src,
          imgNaturalWidth: c.querySelector('img')?.naturalWidth,
          imgNaturalHeight: c.querySelector('img')?.naturalHeight
        }))
      };
    })())`
  });
  console.log('Services Menu Open:', JSON.stringify(JSON.parse(servicesState.result.result.value), null, 2));

  // Capture screenshot of open Services mega menu
  let ssServices = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_mega_menu_open.png', Buffer.from(ssServices.result.data, 'base64'));
  console.log('Saved scratch/services_mega_menu_open.png');

  // 2. Now move mouse to Card 2 ("Application Development")
  let card2PosRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const cards = document.querySelectorAll('#services-mega-menu .mega-menu-card');
      if (cards.length < 2) return null;
      const rect = cards[1].getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })())`
  });
  const posCard2 = JSON.parse(card2PosRes.result.result.value);

  await sendSession('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: posCard2.x,
    y: posCard2.y
  });
  await new Promise(r => setTimeout(r, 400));

  let card2Hover = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const cards = document.querySelectorAll('#services-mega-menu .mega-menu-card');
      const card = cards[1];
      const title = card.querySelector('.mega-card-title');
      const img = card.querySelector('.mega-card-img');
      return {
        cardHovered: card.matches(':hover'),
        titleColor: window.getComputedStyle(title).color,
        imgTransform: window.getComputedStyle(img).transform
      };
    })())`
  });
  console.log('Card 2 Hover Effect:', JSON.parse(card2Hover.result.result.value));

  let ssCard2Hover = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/services_mega_menu_card_hover.png', Buffer.from(ssCard2Hover.result.data, 'base64'));
  console.log('Saved scratch/services_mega_menu_card_hover.png');

  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
