import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_cdp_comp_' + Date.now();
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2e8adeb1-375c-4850-926c-403a790a7841';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9336',
  '--disable-gpu',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const versionRes = await fetch('http://127.0.0.1:9336/json/version');
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
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await sendSession('Page.navigate', { url: 'http://localhost:8080/projects/ashray-labs/' });
  await new Promise(r => setTimeout(r, 1500));

  // Let's inject a CSS & layout test right in the page via Runtime.evaluate to test the new design live!
  await sendSession('Runtime.evaluate', {
    expression: `
      // Test Redesign
      const styleEl = document.createElement('style');
      styleEl.innerHTML = \`
        /* 1. Header Banner Redesign */
        .project-banner-section {
          padding: calc(var(--header-height, 76px) + 20px) 0 24px !important;
          background: linear-gradient(135deg, #ED1C2E 0%, #C41222 65%, #9E0D1B 100%) !important;
        }
        .project-banner-inner {
          max-width: 100% !important;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
        }
        .banner-left-meta {
          flex: 1;
          min-width: 280px;
        }
        .project-headline-title {
          display: block !important;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 2.1rem !important;
          font-weight: 800 !important;
          color: #FFFFFF !important;
          margin: 6px 0 0 0 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.2 !important;
        }
        .project-header-intro {
          display: none !important; /* Eliminate duplicate text */
        }
        .banner-badge-bar {
          display: flex !important;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .banner-badge-category {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #FFFFFF;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .banner-badge-featured {
          background: #FEF3C7 !important;
          color: #92400E !important;
          border: 1px solid #FCD34D !important;
          font-size: 0.72rem !important;
          font-weight: 700 !important;
          padding: 3px 10px !important;
          border-radius: 9999px !important;
        }
        .banner-cta-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-banner-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          color: #ED1C2E;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }
        .btn-banner-live:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          background: #FFF5F5;
        }

        /* 2. Unified Right Column Widget */
        .project-main-section {
          padding: 36px 0 60px !important;
        }
        .project-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) 340px !important;
          gap: 32px !important;
          align-items: start;
        }
        .project-right-col {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          position: sticky !important;
          top: calc(var(--header-height, 76px) + 20px) !important;
        }
        .specs-unified-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .specs-card-header {
          padding: 16px 20px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .specs-card-header h3 {
          margin: 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .specs-card-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F1F5F9;
        }
        .spec-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }
        .spec-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .spec-value-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .spec-subvalue {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.74rem;
          color: #64748B;
        }
        .spec-link-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #ED1C2E;
          color: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(237, 28, 46, 0.25);
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
          margin-top: 4px;
        }
        .spec-link-btn:hover {
          background: #C41222;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(237, 28, 46, 0.35);
        }
      \`;
      document.head.appendChild(styleEl);

      // Re-structure banner
      const bannerInner = document.querySelector('.project-banner-inner');
      const breadcrumb = document.querySelector('.project-breadcrumb');
      const title = document.getElementById('proj-field-title');
      const featured = document.getElementById('proj-field-featured');
      const urlLink = document.getElementById('proj-field-url');

      bannerInner.innerHTML = \`
        <div class="banner-left-meta">
          <nav class="project-breadcrumb" aria-label="Breadcrumb">
            <a href="/index.html">Home</a>
            <span class="project-breadcrumb-sep">/</span>
            <a href="/portfolio.html">Portfolio</a>
            <span class="project-breadcrumb-sep">/</span>
            <span class="breadcrumb-current">\${document.title.split('—')[0].trim()}</span>
          </nav>
          <div class="banner-badge-bar">
            <span class="banner-badge-category">Healthcare &amp; Diagnostics</span>
            <span class="banner-badge-featured" style="display:inline-flex;">★ Featured on Homepage</span>
          </div>
          <h1 class="project-headline-title">\${document.title.split('—')[0].trim()}</h1>
        </div>
        <div class="banner-cta-wrap">
          <a href="https://www.ashraylabs.in/" target="_blank" class="btn-banner-live">
            <span>Visit Live Website</span>
            <span aria-hidden="true">&nearr;</span>
          </a>
        </div>
      \`;

      // Re-structure right column
      const rightCol = document.querySelector('.project-right-col');
      const techHtml = document.getElementById('proj-field-technologies').innerHTML;
      rightCol.innerHTML = \`
        <div class="specs-unified-card">
          <div class="specs-card-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ED1C2E" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <h3>Project Specifications</h3>
          </div>
          <div class="specs-card-body">
            <div class="spec-item">
              <span class="spec-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                Category
              </span>
              <span class="category-badge-pill" style="align-self: flex-start;">Healthcare &amp; Diagnostics</span>
            </div>

            <div class="spec-item">
              <span class="spec-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Service Delivery
              </span>
              <p class="spec-value-text">August 2024</p>
              <span class="spec-subvalue">&#9201; 75 Engineering Days</span>
            </div>

            <div class="spec-item">
              <span class="spec-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Live URL
              </span>
              <a href="https://www.ashraylabs.in/" target="_blank" class="spec-link-btn">
                <span>Visit Live Project</span>
                <span aria-hidden="true">&nearr;</span>
              </a>
            </div>

            <div class="spec-item">
              <span class="spec-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Technologies
              </span>
              <div class="tech-badges-grid">\${techHtml}</div>
            </div>
          </div>
        </div>
      \`;
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ssProto = await sendSession('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/project_detail_redesign_preview.png`, Buffer.from(ssProto.result.data, 'base64'));

  const ssProtoFull = await sendSession('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(`${artifactDir}/project_detail_redesign_full.png`, Buffer.from(ssProtoFull.result.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Saved prototype screenshots!');
  process.exit(0);
} catch (e) {
  console.error(e);
  chrome.kill();
  process.exit(1);
}

