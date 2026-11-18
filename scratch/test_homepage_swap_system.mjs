import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_swap_' + Date.now();

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9396',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9396/json/version');
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
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Step 1: Check initial homepage showcase deck
  console.log('1. Checking Homepage showcase deck...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 1500));
  const hpDeck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.portfolio-showcase-deck .portfolio-feature-card');
      return Array.from(cards).map(c => ({
        slug: c.getAttribute('data-project'),
        title: c.querySelector('.feature-card-title')?.textContent?.trim(),
        cat: c.querySelector('.feature-kicker-cat')?.textContent?.trim()
      }));
    })()`,
    returnByValue: true
  });
  console.log('Initial Homepage cards (count:', hpDeck.result.result.value.length, '):', hpDeck.result.result.value);

  // Step 2: Login to Admin
  console.log('2. Authenticating in Admin...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/login.html' });
  await new Promise(r => setTimeout(r, 1000));
  const loginRes = await sendSession('Runtime.evaluate', {
    expression: `(async () => {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
      });
      const d = await res.json();
      if (d.token) {
        localStorage.setItem('admin_token', d.token);
        localStorage.setItem('admin_user', JSON.stringify(d.user));
      }
      return d;
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Admin login success:', loginRes.result.result.value?.success);

  console.log('Navigating to Admin Projects Manager...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/projects.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Open Edit Modal for "procurve"
  console.log('3. Opening Edit Modal for ProCurve (non-homepage project)...');
  await sendSession('Runtime.evaluate', {
    expression: `openProjectModal('procurve')`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  // Click "Yes" on radio-home-yes
  console.log('4. Clicking "Yes" on Project At Home Page...');
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const radioYes = document.getElementById('radio-home-yes');
      radioYes.checked = true;
      handleHomepageRadioChange(radioYes);
    })()`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify that the Replace Modal opened
  const swapModalState = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.getElementById('homepage-replace-modal');
      const options = Array.from(document.querySelectorAll('#swap-projects-list .swap-project-option')).map(o => ({
        id: o.querySelector('input')?.value,
        title: o.querySelector('div > div:first-child')?.textContent?.trim()
      }));
      return {
        isActive: modal.classList.contains('active'),
        optionsCount: options.length,
        options
      };
    })()`,
    returnByValue: true
  });
  console.log('Swap Modal State:', swapModalState.result.result.value);

  // Capture screenshot of Replace Modal
  const shotModal = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/admin_homepage_replace_modal.png', Buffer.from(shotModal.result.data, 'base64'));
  console.log('Saved admin_homepage_replace_modal.png');

  // Step 5: Select "Chick N Go" to be replaced
  console.log('5. Selecting Chick N Go to be replaced and confirming...');
  await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const chickRadio = document.querySelector('input[name="project_to_replace"][value="chick-n-go"]');
      if (chickRadio) {
        chickRadio.checked = true;
        selectSwapOption(chickRadio.closest('.swap-project-option'));
      }
      confirmHomepageSwap();
    })()`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  // Check alert note in the project modal
  const alertText = await sendSession('Runtime.evaluate', {
    expression: `document.getElementById('homepage-swap-alert')?.textContent`,
    returnByValue: true
  });
  console.log('Form Alert Note:', alertText.result.result.value);

  // Step 6: Submit the project form
  console.log('6. Submitting form to save ProCurve as featured on homepage...');
  const subRes = await sendSession('Runtime.evaluate', {
    expression: `(async () => {
      const evt = new Event('submit', { cancelable: true });
      await handleProjectFormSubmit(evt);
      return { success: true };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Submit response:', subRes.result.result ? subRes.result.result.value : subRes);
  await new Promise(r => setTimeout(r, 2000));

  // Step 7: Check updated homepage showcase deck
  console.log('7. Navigating back to Homepage to verify updated 3 cards...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 1500));
  const updatedDeck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.portfolio-showcase-deck .portfolio-feature-card');
      return Array.from(cards).map(c => ({
        slug: c.getAttribute('data-project'),
        title: c.querySelector('.feature-card-title')?.textContent?.trim()
      }));
    })()`,
    returnByValue: true
  });
  console.log('Updated Homepage Cards (count:', updatedDeck.result.result.value.length, '):', updatedDeck.result.result.value);

  // Capture screenshot of Homepage with ProCurve
  const shotHpUpdated = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/homepage_procurve_swapped.png', Buffer.from(shotHpUpdated.result.data, 'base64'));
  console.log('Saved homepage_procurve_swapped.png');

  // Step 8: Swap Chick N Go back in place of ProCurve
  console.log('8. Swapping Chick N Go back in place of ProCurve to restore initial state...');
  await sendSession('Page.navigate', { url: 'http://localhost:8080/admin/projects.html' });
  await new Promise(r => setTimeout(r, 1500));

  await sendSession('Runtime.evaluate', {
    expression: `openProjectModal('chick-n-go')`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 500));

  await sendSession('Runtime.evaluate', {
    expression: `(async () => {
      const radioYes = document.getElementById('radio-home-yes');
      radioYes.checked = true;
      handleHomepageRadioChange(radioYes);
      const procRadio = document.querySelector('input[name="project_to_replace"][value="procurve"]');
      if (procRadio) {
        procRadio.checked = true;
        selectSwapOption(procRadio.closest('.swap-project-option'));
      }
      confirmHomepageSwap();
      await handleProjectFormSubmit(new Event('submit', { cancelable: true }));
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 2000));

  // Verify restored state
  await sendSession('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 1500));
  const finalDeck = await sendSession('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.portfolio-showcase-deck .portfolio-feature-card');
      return Array.from(cards).map(c => ({
        slug: c.getAttribute('data-project'),
        title: c.querySelector('.feature-card-title')?.textContent?.trim()
      }));
    })()`,
    returnByValue: true
  });
  console.log('Final Restored Homepage Cards:', finalDeck.result.result.value);

  ws.close();
} catch (e) {
  console.error('Error during test:', e);
} finally {
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}
