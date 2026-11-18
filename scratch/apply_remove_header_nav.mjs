import fs from 'fs';

let content = fs.readFileSync('admin/homepage/index.html', 'utf8');

// 1. Update 10-Tab Navigation Bar to 9-Tab (remove Header & Nav, Hero is 01 and active)
const oldTabBar = `        <!-- 10-Tab Navigation Bar -->
        <div class="hp-tab-bar" id="homepage-tab-bar">
          <button class="hp-tab-btn active" data-tab="header" onclick="switchSectionTab('header')">
            <span class="hp-tab-num">01</span>
            <span>Header &amp; Nav</span>
            <span class="hp-tab-status" id="tab-status-header"></span>
          </button>
          <button class="hp-tab-btn" data-tab="hero" onclick="switchSectionTab('hero')">
            <span class="hp-tab-num">02</span>
            <span>Hero Section</span>
            <span class="hp-tab-status" id="tab-status-hero"></span>
          </button>
          <button class="hp-tab-btn" data-tab="radar" onclick="switchSectionTab('radar')">
            <span class="hp-tab-num">03</span>
            <span>Client Radar</span>
            <span class="hp-tab-status" id="tab-status-radar"></span>
          </button>
          <button class="hp-tab-btn" data-tab="services" onclick="switchSectionTab('services')">
            <span class="hp-tab-num">04</span>
            <span>Core Services (6)</span>
            <span class="hp-tab-status" id="tab-status-services"></span>
          </button>
          <button class="hp-tab-btn" data-tab="featured_work" onclick="switchSectionTab('featured_work')">
            <span class="hp-tab-num">05</span>
            <span>Featured Work</span>
            <span class="hp-tab-status" id="tab-status-featured_work"></span>
          </button>
          <button class="hp-tab-btn" data-tab="case_studies" onclick="switchSectionTab('case_studies')">
            <span class="hp-tab-num">06</span>
            <span>Case Studies</span>
            <span class="hp-tab-status" id="tab-status-case_studies"></span>
          </button>
          <button class="hp-tab-btn" data-tab="how_we_work" onclick="switchSectionTab('how_we_work')">
            <span class="hp-tab-num">07</span>
            <span>How We Work</span>
            <span class="hp-tab-status" id="tab-status-how_we_work"></span>
          </button>
          <button class="hp-tab-btn" data-tab="next_steps" onclick="switchSectionTab('next_steps')">
            <span class="hp-tab-num">08</span>
            <span>Next Steps / CTA</span>
            <span class="hp-tab-status" id="tab-status-next_steps"></span>
          </button>
          <button class="hp-tab-btn" data-tab="footer" onclick="switchSectionTab('footer')">
            <span class="hp-tab-num">09</span>
            <span>Footer &amp; Brand</span>
            <span class="hp-tab-status" id="tab-status-footer"></span>
          </button>
          <button class="hp-tab-btn" data-tab="overview" onclick="switchSectionTab('overview')">
            <span class="hp-tab-num">10</span>
            <span>Sections Hub</span>
          </button>
        </div>`;

const newTabBar = `        <!-- 9-Tab Navigation Bar -->
        <div class="hp-tab-bar" id="homepage-tab-bar">
          <button class="hp-tab-btn active" data-tab="hero" onclick="switchSectionTab('hero')">
            <span class="hp-tab-num">01</span>
            <span>Hero Section</span>
            <span class="hp-tab-status" id="tab-status-hero"></span>
          </button>
          <button class="hp-tab-btn" data-tab="radar" onclick="switchSectionTab('radar')">
            <span class="hp-tab-num">02</span>
            <span>Client Radar</span>
            <span class="hp-tab-status" id="tab-status-radar"></span>
          </button>
          <button class="hp-tab-btn" data-tab="services" onclick="switchSectionTab('services')">
            <span class="hp-tab-num">03</span>
            <span>Core Services (6)</span>
            <span class="hp-tab-status" id="tab-status-services"></span>
          </button>
          <button class="hp-tab-btn" data-tab="featured_work" onclick="switchSectionTab('featured_work')">
            <span class="hp-tab-num">04</span>
            <span>Featured Work</span>
            <span class="hp-tab-status" id="tab-status-featured_work"></span>
          </button>
          <button class="hp-tab-btn" data-tab="case_studies" onclick="switchSectionTab('case_studies')">
            <span class="hp-tab-num">05</span>
            <span>Case Studies</span>
            <span class="hp-tab-status" id="tab-status-case_studies"></span>
          </button>
          <button class="hp-tab-btn" data-tab="how_we_work" onclick="switchSectionTab('how_we_work')">
            <span class="hp-tab-num">06</span>
            <span>How We Work</span>
            <span class="hp-tab-status" id="tab-status-how_we_work"></span>
          </button>
          <button class="hp-tab-btn" data-tab="next_steps" onclick="switchSectionTab('next_steps')">
            <span class="hp-tab-num">07</span>
            <span>Next Steps / CTA</span>
            <span class="hp-tab-status" id="tab-status-next_steps"></span>
          </button>
          <button class="hp-tab-btn" data-tab="footer" onclick="switchSectionTab('footer')">
            <span class="hp-tab-num">08</span>
            <span>Footer &amp; Brand</span>
            <span class="hp-tab-status" id="tab-status-footer"></span>
          </button>
          <button class="hp-tab-btn" data-tab="overview" onclick="switchSectionTab('overview')">
            <span class="hp-tab-num">09</span>
            <span>Sections Hub</span>
          </button>
        </div>`;

if (!content.includes(oldTabBar)) {
  console.error('Could not find oldTabBar');
  process.exit(1);
}
content = content.replace(oldTabBar, newTabBar);

// 2. Remove panel-header and make panel-hero active
const panelHeaderStart = content.indexOf('<!-- ================================================================= -->\n        <!-- TAB 01: HEADER & NAVIGATION -->');
const panelHeroStart = content.indexOf('<!-- ================================================================= -->\n        <!-- TAB 02: HERO SECTION -->');

if (panelHeaderStart === -1 || panelHeroStart === -1) {
  console.error('Could not find panel header start or hero start');
  process.exit(1);
}

// Slice out panel-header
const beforeHeader = content.substring(0, panelHeaderStart);
const fromHero = content.substring(panelHeroStart);

content = beforeHeader + fromHero;

// 3. Make panel-hero active and renumber its header
content = content.replace(
  '<!-- TAB 02: HERO SECTION -->\n        <!-- ================================================================= -->\n        <div class="hp-tab-panel" id="panel-hero">',
  '<!-- TAB 01: HERO SECTION -->\n        <!-- ================================================================= -->\n        <div class="hp-tab-panel active" id="panel-hero">'
);
content = content.replace(
  '<span>02. Hero Section (Interactive Spotlight Lens)</span>',
  '<span>01. Hero Section (Interactive Spotlight Lens)</span>'
);
content = content.replace(
  '<span>03. Client Radar Section</span>',
  '<span>02. Client Radar Section</span>'
);
content = content.replace(
  '<span>04. Core Services Section (6 Cards)</span>',
  '<span>03. Core Services Section (6 Cards)</span>'
);
content = content.replace(
  '<span>05. Featured Portfolio Work</span>',
  '<span>04. Featured Portfolio Work</span>'
);
content = content.replace(
  '<span>06. Case Studies Section</span>',
  '<span>05. Case Studies Section</span>'
);
content = content.replace(
  '<span>07. How We Work (Methodology)</span>',
  '<span>06. How We Work (Methodology)</span>'
);
content = content.replace(
  '<span>08. Next Steps / Final CTA</span>',
  '<span>07. Next Steps / Final CTA</span>'
);
content = content.replace(
  '<span>09. Footer &amp; Disclaimers</span>',
  '<span>08. Footer &amp; Disclaimers</span>'
);

// 4. In panel-overview: Remove Header & Navigation card and renumber
const oldHubHeaderCard = `            <div class="card" style="padding:20px; cursor:pointer;" onclick="switchSectionTab('header')">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:800; font-size:12px; color:#E7192D;">SECTION 01</span>
                <span class="badge" id="hub-badge-header">Published</span>
              </div>
              <h3 style="font-size:17px; font-weight:700; margin:0 0 6px 0; color:#0F172A;">Header &amp; Navigation</h3>
              <p style="font-size:13px; color:#64748B; margin:0 0 14px 0;">Logo, main navigation links, Let's Talk CTA button, and Portfolio mega-menu.</p>
              <span style="font-size:13px; font-weight:700; color:#E7192D;">Edit Section &rarr;</span>
            </div>`;

if (!content.includes(oldHubHeaderCard)) {
  console.error('Could not find oldHubHeaderCard');
  process.exit(1);
}

content = content.replace(oldHubHeaderCard, '');
content = content.replace('SECTION 02</span>\n                <span class="badge" id="hub-badge-hero"', 'SECTION 01</span>\n                <span class="badge" id="hub-badge-hero"');
content = content.replace('SECTION 03</span>\n                <span class="badge" id="hub-badge-radar"', 'SECTION 02</span>\n                <span class="badge" id="hub-badge-radar"');
content = content.replace('SECTION 04</span>\n                <span class="badge" id="hub-badge-services"', 'SECTION 03</span>\n                <span class="badge" id="hub-badge-services"');
content = content.replace('SECTION 05</span>\n                <span class="badge" id="hub-badge-featured_work"', 'SECTION 04</span>\n                <span class="badge" id="hub-badge-featured_work"');
content = content.replace('SECTION 06</span>\n                <span class="badge" id="hub-badge-case_studies"', 'SECTION 05</span>\n                <span class="badge" id="hub-badge-case_studies"');
content = content.replace('SECTION 07</span>\n                <span class="badge" id="hub-badge-how_we_work"', 'SECTION 06</span>\n                <span class="badge" id="hub-badge-how_we_work"');
content = content.replace('SECTION 08</span>\n                <span class="badge" id="hub-badge-next_steps"', 'SECTION 07</span>\n                <span class="badge" id="hub-badge-next_steps"');
content = content.replace('SECTION 09</span>\n                <span class="badge" id="hub-badge-footer"', 'SECTION 08</span>\n                <span class="badge" id="hub-badge-footer"');
content = content.replace('all 9 content blocks on the homepage.', 'all 8 content blocks on the homepage.');

// 5. Update JS: publishAllSections, default tab
content = content.replace(
  "const sections = ['header', 'hero', 'radar', 'services', 'featured_work', 'case_studies', 'how_we_work', 'next_steps', 'footer'];",
  "const sections = ['hero', 'radar', 'services', 'featured_work', 'case_studies', 'how_we_work', 'next_steps', 'footer'];"
);
content = content.replace(
  "showToast(`🎉 All 9 homepage sections published live! (v${data.version})`);",
  "showToast(`🎉 All 8 homepage sections published live! (v${data.version})`);"
);
content = content.replace(
  "const valid = ['header', 'hero', 'radar', 'services', 'featured_work', 'case_studies', 'how_we_work', 'next_steps', 'footer', 'overview'];",
  "const valid = ['hero', 'radar', 'services', 'featured_work', 'case_studies', 'how_we_work', 'next_steps', 'footer', 'overview'];"
);
content = content.replace(
  "if (['header', 'hero', 'radar', 'services', 'featured_work', 'case_studies', 'how_we_work', 'next_steps', 'footer', 'overview'].includes(h))",
  "if (['hero', 'radar', 'services', 'featured_work', 'case_studies', 'how_we_work', 'next_steps', 'footer', 'overview'].includes(h))"
);

fs.writeFileSync('admin/homepage/index.html', content, 'utf8');
console.log('Successfully updated admin/homepage/index.html!');

