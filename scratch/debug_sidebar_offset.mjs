import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_align_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9350',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9350/json/version');
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
  await sendSession('Runtime.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/vishan-institute-of-technology/' });
  await new Promise(r => setTimeout(r, 1200));

  const rects = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const goals = document.querySelector('.project-content-block');
      const rightCol = document.querySelector('.project-right-col');
      const specsCard = document.querySelector('.specs-unified-card');
      const grid = document.querySelector('.project-main-grid');
      const leftCol = document.querySelector('.project-left-col');
      return {
        grid: grid ? { top: grid.getBoundingClientRect().top, offsetTop: grid.offsetTop } : null,
        leftCol: leftCol ? { top: leftCol.getBoundingClientRect().top, offsetTop: leftCol.offsetTop } : null,
        goals: goals ? { top: goals.getBoundingClientRect().top, offsetTop: goals.offsetTop, marginTop: window.getComputedStyle(goals).marginTop } : null,
        rightCol: rightCol ? {
          top: rightCol.getBoundingClientRect().top,
          offsetTop: rightCol.offsetTop,
          position: window.getComputedStyle(rightCol).position,
          stickyTop: window.getComputedStyle(rightCol).top,
          marginTop: window.getComputedStyle(rightCol).marginTop,
          paddingTop: window.getComputedStyle(rightCol).paddingTop
        } : null,
        specsCard: specsCard ? {
          top: specsCard.getBoundingClientRect().top,
          offsetTop: specsCard.offsetTop,
          marginTop: window.getComputedStyle(specsCard).marginTop,
          transform: window.getComputedStyle(specsCard).transform
        } : null
      };
    })()`,
    returnByValue: true
  });

  const gridStyles = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const grid = document.querySelector('.project-main-grid');
      const left = document.querySelector('.project-left-col');
      const right = document.querySelector('.project-right-col');
      return {
        gridTemplateColumns: window.getComputedStyle(grid).gridTemplateColumns,
        gridTemplateRows: window.getComputedStyle(grid).gridTemplateRows,
        leftGridRow: window.getComputedStyle(left).gridRow,
        leftGridColumn: window.getComputedStyle(left).gridColumn,
        rightGridRow: window.getComputedStyle(right).gridRow,
        rightGridColumn: window.getComputedStyle(right).gridColumn,
        rightMargin: window.getComputedStyle(right).margin,
        rightTop: window.getComputedStyle(right).top,
        rightAlignSelf: window.getComputedStyle(right).alignSelf
      };
    })()`,
    returnByValue: true
  });
  const checkOffsetParent = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const left = document.querySelector('.project-left-col');
      const right = document.querySelector('.project-right-col');
      return {
        leftOffsetParent: left.offsetParent?.tagName + '.' + left.offsetParent?.className,
        rightOffsetParent: right.offsetParent?.tagName + '.' + right.offsetParent?.className,
        leftPrevSibling: left.previousElementSibling?.tagName,
        rightPrevSibling: right.previousElementSibling?.tagName,
        gridComputed: {
          display: window.getComputedStyle(left.parentElement).display,
          alignItems: window.getComputedStyle(left.parentElement).alignItems
        }
      };
    })()`,
    returnByValue: true
  });
  const testStatic = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const right = document.querySelector('.project-right-col');
      const left = document.querySelector('.project-left-col');
      const before = {
        leftTop: left.getBoundingClientRect().top,
        rightTop: right.getBoundingClientRect().top,
        rightPosition: window.getComputedStyle(right).position
      };
      right.style.position = 'static';
      const after = {
        leftTop: left.getBoundingClientRect().top,
        rightTop: right.getBoundingClientRect().top,
        rightPosition: window.getComputedStyle(right).position
      };
      return { before, after };
    })()`,
    returnByValue: true
  });
  const testOverflowAndSticky = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const section = document.querySelector('.project-main-section');
      const right = document.querySelector('.project-right-col');
      const left = document.querySelector('.project-left-col');
      
      // Test 1: Remove overflow-x from section
      section.style.overflowX = 'visible';
      section.style.overflow = 'visible';
      const withVisibleOverflow = {
        leftTop: left.getBoundingClientRect().top,
        rightTop: right.getBoundingClientRect().top,
        stickyTop: window.getComputedStyle(right).top
      };

      // Test 2: If position static
      right.style.position = 'static';
      const withStatic = {
        leftTop: left.getBoundingClientRect().top,
        rightTop: right.getBoundingClientRect().top
      };

      return { withVisibleOverflow, withStatic };
    })()`,
    returnByValue: true
  });
  console.log('OVERFLOW & STICKY TEST:', JSON.stringify(testOverflowAndSticky.result?.result?.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}
