import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9498',
  '--disable-gpu',
  '--no-first-run',
  '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_test_scroll_' + Date.now(),
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const v = await fetch('http://127.0.0.1:9498/json/version').then(r => r.json());
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const p = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); }
  };
  function send(method, params = {}) {
    return new Promise(res => {
      const cur = id++;
      p.set(cur, res);
      ws.send(JSON.stringify({ id: cur, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 2500));

  // Check 1: Button is not present in DOM
  const checkButtons = await send('Runtime.evaluate', {
    expression: `({
      tourBar: !!document.getElementById('autoTourBar'),
      tourBtn: !!document.getElementById('autoTourBtn'),
      initialScrollY: window.scrollY
    })`,
    returnByValue: true
  });
  console.log('Button Check:', JSON.stringify(checkButtons.result.value));

  // Check 2: Hover on Services Accordion item
  const hoverTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const firstItem = document.querySelector('.service-acc-item:first-child');
      if (!firstItem) return { found: false };
      firstItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      const activeAfterEnter = firstItem.classList.contains('is-active');
      firstItem.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      const activeAfterLeave = firstItem.classList.contains('is-active');
      const headerText = firstItem.querySelector('.service-acc-header')?.innerText;
      return { found: true, activeAfterEnter, activeAfterLeave, headerText };
    })()`,
    returnByValue: true
  });
  console.log('Services Hover Check:', JSON.stringify(hoverTest.result.value));

  // Check 3: Wait 10 seconds for initial hero dwell (1.5s init + 7.5s dwell = 9.0s -> advance to radar)
  console.log('Waiting 10.5 seconds to observe auto-scroll progression...');
  await new Promise(r => setTimeout(r, 10500));

  const checkScroll = await send('Runtime.evaluate', {
    expression: `({
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
      radarTop: document.getElementById('radar-section')?.getBoundingClientRect().top
    })`,
    returnByValue: true
  });
  console.log('Scroll Position after 10.5s:', JSON.stringify(checkScroll.result.value));

  // Check 4: Test manual scroll interruption
  console.log('Simulating manual user wheel scroll...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
    })()`
  });

  await new Promise(r => setTimeout(r, 1000));
  console.log('Manual wheel dispatched successfully.');

  ws.close();
} catch (e) {
  console.error('Error during test:', e);
} finally {
  chrome.kill();
  console.log('Test completed.');
}
