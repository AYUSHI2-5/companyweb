import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_port_test_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9395',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9395/json/version');
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
      ws.send(JSON.stringify({ sessionId, id: msgId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Runtime.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:8080/portfolio.html ...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/portfolio.html' });
  await new Promise(r => setTimeout(r, 2500));

  // Scroll to #portfolio-filters
  await sendSession('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('portfolio-filters');
      if (sec) sec.scrollIntoView();
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Inspect cards
  const cardDetails = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const cards = document.querySelectorAll('.portfolio-card');
        const btns = document.querySelectorAll('.btn-portfolio-view');
        return {
          totalCards: cards.length,
          visibleButtons: Array.from(btns).filter(b => b.offsetParent !== null).length,
          sampleCards: Array.from(cards).slice(0, 4).map(c => {
            const rect = c.getBoundingClientRect();
            return {
              tag: c.tagName,
              href: c.getAttribute('href'),
              title: c.querySelector('.portfolio-card-title')?.textContent?.trim(),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              cursor: window.getComputedStyle(c).cursor
            };
          })
        };
      })()
    `
  });

  console.log('Portfolio card stats:', JSON.stringify(cardDetails.result?.result?.value, null, 2));

  // Screenshot compact grid
  const artDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';
  const ssGrid = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artDir, 'portfolio_page_compact_grid.png'), Buffer.from(ssGrid.result.data, 'base64'));
  console.log('Saved: portfolio_page_compact_grid.png');

  // Test filter tab "Mobile Applications"
  console.log('Testing category filter: Mobile Applications...');
  await sendSession('Runtime.evaluate', {
    expression: `
      const mobileBtn = document.querySelector('.portfolio-filter-btn[data-filter="mobile"]');
      if (mobileBtn) mobileBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const filterStats = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const visibleCards = Array.from(document.querySelectorAll('.portfolio-card'))
          .filter(c => !c.classList.contains('is-hidden') && c.closest('.portfolio-category-section').style.display !== 'none');
        return {
          visibleCount: visibleCards.length,
          titles: visibleCards.map(c => c.querySelector('.portfolio-card-title')?.textContent?.trim())
        };
      })()
    `
  });
  console.log('Filter stats (Mobile):', JSON.stringify(filterStats.result?.result?.value, null, 2));

  const ssFilter = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artDir, 'portfolio_page_filter_mobile.png'), Buffer.from(ssFilter.result.data, 'base64'));
  console.log('Saved: portfolio_page_filter_mobile.png');

  // Test card click navigation on the first mobile card (KP E-Services)
  console.log('Clicking on first visible card...');
  await sendSession('Runtime.evaluate', {
    expression: `
      const firstCard = document.querySelector('.portfolio-card[data-category="mobile"]:not(.is-hidden)');
      if (firstCard) firstCard.click();
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  const currentUrl = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: 'window.location.href'
  });
  console.log('URL after clicking card:', currentUrl.result?.result?.value);

  const currentTitle = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.title'
  });
  console.log('Title after clicking card:', currentTitle.result?.result?.value);

  const ssDetail = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artDir, 'portfolio_card_click_detail.png'), Buffer.from(ssDetail.result.data, 'base64'));
  console.log('Saved: portfolio_card_click_detail.png');

  ws.close();
} catch (err) {
  console.error('Test error:', err);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}

