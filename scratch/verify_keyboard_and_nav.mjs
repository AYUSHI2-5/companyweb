import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_a11y_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9453',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let versionRes = await fetch('http://127.0.0.1:9453/json/version');
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
  await new Promise(r => setTimeout(r, 1500));

  // 1. Focus trigger
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const trigger = document.querySelector('#nav-portfolio-link');
      trigger.focus();
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  let focusRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const menu = document.querySelector('.portfolio-mega-menu');
      const item = document.querySelector('.nav-item-has-dropdown');
      const trigger = document.querySelector('#nav-portfolio-link');
      return {
        focusedEl: document.activeElement.id,
        isOpenClass: item.classList.contains('is-open'),
        ariaExpanded: trigger.getAttribute('aria-expanded'),
        menuVisible: window.getComputedStyle(menu).visibility
      };
    })())`
  });
  console.log('Focus Result:', focusRes.result.result.value);

  // 2. Press Escape key
  await sendSession('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
  await sendSession('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  await new Promise(r => setTimeout(r, 400));

  let escRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const menu = document.querySelector('.portfolio-mega-menu');
      const item = document.querySelector('.nav-item-has-dropdown');
      const trigger = document.querySelector('#nav-portfolio-link');
      return {
        focusedEl: document.activeElement.id,
        isOpenClass: item.classList.contains('is-open'),
        ariaExpanded: trigger.getAttribute('aria-expanded'),
        menuVisible: window.getComputedStyle(menu).visibility
      };
    })())`
  });
  console.log('Escape Result:', escRes.result.result.value);

  // 3. Test portfolio.html?filter=creative URL filtering
  await sendSession('Page.navigate', { url: 'http://127.0.0.1:8080/portfolio.html?filter=creative' });
  await new Promise(r => setTimeout(r, 1500));

  let filterRes = await sendSession('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const activeBtn = document.querySelector('.portfolio-filter-btn.is-active');
      const visibleCards = Array.from(document.querySelectorAll('.portfolio-card-item')).filter(c => c.style.display !== 'none');
      return {
        activeFilter: activeBtn ? activeBtn.getAttribute('data-filter') : null,
        activeFilterText: activeBtn ? activeBtn.innerText.trim() : null,
        visibleCardsCount: visibleCards.length,
        cardTitles: visibleCards.map(c => c.querySelector('.portfolio-card-title')?.innerText.trim())
      };
    })())`
  });
  console.log('Portfolio Filter from URL Result:', filterRes.result.result.value);

  ws.close();
  chrome.kill();
}
run().catch(e => { console.error(e); chrome.kill(); });
