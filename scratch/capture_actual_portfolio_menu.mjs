import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_port_' + Date.now();

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
  await sendSession('DOM.enable');
  await sendSession('CSS.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1400,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:8080/index.html...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/index.html' });
  await new Promise(r => setTimeout(r, 2500));

  // Find portfolio nav link coordinates
  let doc = await sendSession('DOM.getDocument');
  let node = await sendSession('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: '#nav-portfolio-item' });
  let box = await sendSession('DOM.getBoxModel', { nodeId: node.result.nodeId });
  let content = box.result.model.content;
  let centerX = (content[0] + content[2]) / 2;
  let centerY = (content[1] + content[5]) / 2;

  console.log(`Moving mouse to Portfolio link at (${centerX}, ${centerY})...`);
  await sendSession('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: centerX,
    y: centerY
  });
  await new Promise(r => setTimeout(r, 700));

  // Capture screenshot of open mega menu
  let shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPath1 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_mega_menu_actual_categories.png';
  fs.writeFileSync(shotPath1, Buffer.from(shot1.result.data, 'base64'));
  console.log(`Saved screenshot 1 to: ${shotPath1}`);

  // Hover over the third card (Enterprise Software & ERP)
  let menuNode = await sendSession('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: '#portfolio-mega-menu .mega-menu-card[data-category="enterprise"]' });
  if (menuNode.result.nodeId) {
    let cardBox = await sendSession('DOM.getBoxModel', { nodeId: menuNode.result.nodeId });
    let cardContent = cardBox.result.model.content;
    let cardX = (cardContent[0] + cardContent[2]) / 2;
    let cardY = (cardContent[1] + cardContent[5]) / 2;

    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: cardX,
      y: cardY
    });
    await new Promise(r => setTimeout(r, 500));

    let shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
    const shotPath2 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_mega_menu_card_hover.png';
    fs.writeFileSync(shotPath2, Buffer.from(shot2.result.data, 'base64'));
    console.log(`Saved screenshot 2 to: ${shotPath2}`);
  }

  // Navigate to portfolio.html to test filter functionality
  console.log('Navigating to http://localhost:8080/portfolio.html?filter=enterprise...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/portfolio.html?filter=enterprise' });
  await new Promise(r => setTimeout(r, 2000));

  let shot3 = await sendSession('Page.captureScreenshot', { format: 'png' });
  const shotPath3 = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841\\portfolio_filtered_enterprise.png';
  fs.writeFileSync(shotPath3, Buffer.from(shot3.result.data, 'base64'));
  console.log(`Saved screenshot 3 to: ${shotPath3}`);

  await send('Browser.close');
  chrome.kill();
  console.log('Done!');
}

run().catch(err => {
  console.error('Error:', err);
  chrome.kill();
  process.exit(1);
});
