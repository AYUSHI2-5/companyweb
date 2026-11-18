import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_deck_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9393',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9393/json/version');
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

  console.log('Navigating to homepage...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 2500));

  // Scroll to #portfolio-showcase-section
  await sendSession('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('portfolio-showcase-section');
      if (sec) sec.scrollIntoView();
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Inspect cards
  const cardDetails = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const cards = document.querySelectorAll('.portfolio-feature-card');
        const btns = document.querySelectorAll('.feature-action-btn');
        return {
          cardCount: cards.length,
          visibleBtns: Array.from(btns).filter(b => b.offsetParent !== null).length,
          cards: Array.from(cards).map(c => {
            const rect = c.getBoundingClientRect();
            return {
              tag: c.tagName,
              href: c.getAttribute('href'),
              title: c.querySelector('.feature-card-title')?.textContent?.trim(),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              cursor: window.getComputedStyle(c).cursor
            };
          })
        };
      })()
    `
  });

  console.log('Card inspection details:', JSON.stringify(cardDetails.result?.result?.value, null, 2));

  // Screenshot portfolio deck
  const ss1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const artDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';
  fs.writeFileSync(path.join(artDir, 'homepage_compact_portfolio_deck.png'), Buffer.from(ss1.result.data, 'base64'));
  console.log('Saved screenshot: homepage_compact_portfolio_deck.png');

  // Test clicking first card
  console.log('Clicking on the first card...');
  await sendSession('Runtime.evaluate', {
    expression: `
      const firstCard = document.querySelector('.portfolio-feature-card');
      if (firstCard) firstCard.click();
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  const currentUrl = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: 'window.location.href'
  });
  console.log('URL after clicking card:', currentUrl.result?.result?.value);

  const titleAfterClick = await sendSession('Runtime.evaluate', {
    returnByValue: true,
    expression: 'document.title'
  });
  console.log('Page title after clicking card:', titleAfterClick.result?.result?.value);

  const ss2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artDir, 'card_click_redirect_verified.png'), Buffer.from(ss2.result.data, 'base64'));
  console.log('Saved screenshot: card_click_redirect_verified.png');

  ws.close();
} catch (err) {
  console.error('Test error:', err);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}
