import re

# 1. Update index.html
portfolio_section_html = """    <!-- =====================================================================
         Section: Featured Portfolio Showcase (3-Project Interactive Gallery)
         Visual: 3 Flagship Projects with 3D perspective tilt, live metric beacons,
         device mockup frames, and dynamic interactive spotlight
         ===================================================================== -->
    <section class="portfolio-showcase-section" id="portfolio-showcase-section" aria-labelledby="portfolio-showcase-heading">
      <div class="section-container">
        <!-- Split Editorial Header -->
        <div class="portfolio-showcase-header scroll-reveal">
          <div class="portfolio-header-left">
            <div class="portfolio-kicker-capsule">
              <span class="portfolio-kicker-dot" aria-hidden="true"></span>
              <span>(03) Featured Work</span>
            </div>
            <h2 class="portfolio-main-title" id="portfolio-showcase-heading">
              Crafted for Impact.<br>
              <span class="text-brand-red">Engineered for Scale.</span>
            </h2>
          </div>
          <div class="portfolio-header-right">
            <p class="portfolio-subtext">
              Explore flagship enterprise cloud platforms, mobile applications, and high-conversion e-commerce engines engineered by our studio.
            </p>
            <a href="portfolio.html" class="btn-all-portfolio" aria-label="Explore all portfolio case studies">
              <span>All Projects</span>
              <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </div>

        <!-- 3 Flagship Showcase Deck -->
        <div class="portfolio-showcase-deck">
          <!-- Project 01: Enterprise Cloud & ERP -->
          <article class="portfolio-feature-card scroll-reveal" data-project="erp">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">app.enterprise.io/dashboard</span>
              </div>
              <div class="feature-media-overflow">
                <img src="assets/about-office.jpg" alt="Enterprise Management Platform Interface" class="feature-media-img" width="460" height="280">
              </div>
              <div class="feature-live-pill">
                <span class="live-dot-beacon"></span>
                <span>99.98% Uptime &middot; 4x Speed</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">Web Platform</span>
                <span class="feature-kicker-idx">01</span>
              </div>
              <h3 class="feature-card-title">Business Management &amp; ERP</h3>
              <p class="feature-card-desc">
                Centralized multi-tenant cloud architecture automating complex operations, database sync, and reporting engines for 15,000+ daily users.
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  <span class="feature-tech-pill">React</span>
                  <span class="feature-tech-pill">Python</span>
                  <span class="feature-tech-pill">PostgreSQL</span>
                </div>
                <a href="portfolio.html" class="feature-action-btn" aria-label="View Business Management Platform Case Study">
                  <span>View Case</span>
                  <span class="feature-btn-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </article>

          <!-- Project 02: Mobile Health & FinTech App -->
          <article class="portfolio-feature-card scroll-reveal" data-project="mobile">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">App Store &middot; Google Play</span>
              </div>
              <div class="feature-media-overflow">
                <img src="assets/case-fitness-app.jpg" alt="Smart Mobile Application Interface" class="feature-media-img" width="460" height="280">
              </div>
              <div class="feature-live-pill feature-live-pill-emerald">
                <span class="live-dot-beacon beacon-emerald"></span>
                <span>★ 4.9 Rating &middot; 50k+ Installs</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">Mobile Ecosystem</span>
                <span class="feature-kicker-idx">02</span>
              </div>
              <h3 class="feature-card-title">Next-Gen Smart Mobile App</h3>
              <p class="feature-card-desc">
                Cross-platform mobile application with biometric authentication, sub-second API transactions, push notifications, and offline sync.
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  <span class="feature-tech-pill">Flutter</span>
                  <span class="feature-tech-pill">Firebase</span>
                  <span class="feature-tech-pill">REST APIs</span>
                </div>
                <a href="portfolio.html" class="feature-action-btn" aria-label="View Smart Mobile App Case Study">
                  <span>View Case</span>
                  <span class="feature-btn-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </article>

          <!-- Project 03: Omnichannel E-Commerce Engine -->
          <article class="portfolio-feature-card scroll-reveal" data-project="ecommerce">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">store.globalbrand.com</span>
              </div>
              <div class="feature-media-overflow">
                <img src="assets/cta-collaboration.jpg" alt="Omnichannel D2C Store Interface" class="feature-media-img" width="460" height="280">
              </div>
              <div class="feature-live-pill feature-live-pill-blue">
                <span class="live-dot-beacon beacon-blue"></span>
                <span>▲ +180% Sales Growth</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">E-Commerce Scale</span>
                <span class="feature-kicker-idx">03</span>
              </div>
              <h3 class="feature-card-title">Omnichannel D2C Retail Platform</h3>
              <p class="feature-card-desc">
                High-performance headless e-commerce store with 0.5s sub-second page loads, multi-currency checkout, and warehouse ERP integration.
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  <span class="feature-tech-pill">Shopify</span>
                  <span class="feature-tech-pill">Next.js</span>
                  <span class="feature-tech-pill">Stripe</span>
                </div>
                <a href="portfolio.html" class="feature-action-btn" aria-label="View D2C Retail Platform Case Study">
                  <span>View Case</span>
                  <span class="feature-btn-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\index.html', 'r', encoding='utf-8') as f:
    idx_html = f.read()

# Insert before case-studies-section
target_marker = '    <!-- =====================================================================\n         Section: Case Studies (Results You Can Count)'
if target_marker in idx_html:
    idx_html = idx_html.replace(target_marker, portfolio_section_html + '\n' + target_marker)
    # Update Case Studies kicker to (04) Case Studies
    idx_html = idx_html.replace('<span>(03) Case Studies</span>', '<span>(04) Case Studies</span>')
    # Update snap nav with featured work dot
    old_snap_nav = '<li><a href="#services-section" class="snap-nav-dot" data-section="services-section" aria-label="Our Services"><span class="snap-tooltip">Services</span></a></li>'
    new_snap_nav = old_snap_nav + '\n      <li><a href="#portfolio-showcase-section" class="snap-nav-dot" data-section="portfolio-showcase-section" aria-label="Featured Work"><span class="snap-tooltip">Featured Work</span></a></li>'
    idx_html = idx_html.replace(old_snap_nav, new_snap_nav)
    # Update style.css cache buster
    idx_html = idx_html.replace('href="style.css"', 'href="style.css?v=7"')
    idx_html = idx_html.replace('href="style.css?v=', 'href="style.css?v=7"')
    with open(r'c:\Users\Admin\Desktop\Baadam.com\index.html', 'w', encoding='utf-8') as f:
        f.write(idx_html)
    print("Updated index.html successfully with Featured Portfolio section.")
else:
    print("Could not find target marker in index.html!")

# 2. Update style.css with Portfolio Showcase section styles
css_portfolio_addon = """
/* =====================================================================
   Featured Portfolio Showcase Section (3-Project Interactive Deck)
   ===================================================================== */
.portfolio-showcase-section {
  position: relative;
  background-color: #ffffff;
  color: #111827;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  padding: calc(var(--header-height, 76px) + 8px) clamp(20px, 3vw, 40px) 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

.portfolio-showcase-section .section-container {
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.portfolio-showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.portfolio-header-left {
  max-width: 620px;
}

.portfolio-kicker-capsule {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(231, 25, 45, 0.08);
  border: 1px solid rgba(231, 25, 45, 0.2);
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #E7192D;
  margin-bottom: 8px;
}

.portfolio-kicker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E7192D;
  box-shadow: 0 0 6px #E7192D;
}

.portfolio-main-title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 2.5vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #111827;
  margin: 0;
}

.portfolio-header-right {
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.portfolio-subtext {
  font-size: clamp(0.82rem, 0.9vw, 0.92rem);
  line-height: 1.5;
  color: #64748b;
  margin: 0;
}

.btn-all-portfolio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  background: #111827;
  color: #ffffff;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-all-portfolio:hover {
  background: #E7192D;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(231, 25, 45, 0.3);
}

.btn-all-portfolio .btn-arrow-circle {
  font-size: 0.9rem;
}

/* 3-Card Deck */
.portfolio-showcase-deck {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(14px, 1.8vw, 26px);
  align-items: stretch;
  flex-grow: 1;
  margin-top: 8px;
  margin-bottom: 4px;
}

.portfolio-feature-card {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
  transform-style: preserve-3d;
  cursor: pointer;
}

.portfolio-feature-card:hover {
  border-color: rgba(231, 25, 45, 0.35);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08), 0 8px 24px rgba(231, 25, 45, 0.1);
}

.portfolio-feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(231, 25, 45, 0.07), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.portfolio-feature-card:hover::before {
  opacity: 1;
}

.feature-card-media-wrap {
  position: relative;
  background: #f1f5f9;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.feature-card-chrome-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: #ffffff;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.chrome-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.chrome-dot-red { background: #ef4444; }
.chrome-dot-yellow { background: #f59e0b; }
.chrome-dot-green { background: #10b981; }

.chrome-url-pill {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  color: #94a3b8;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.feature-media-overflow {
  height: clamp(130px, 14vh, 175px);
  overflow: hidden;
  position: relative;
}

.feature-media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.portfolio-feature-card:hover .feature-media-img {
  transform: scale(1.07);
}

.feature-live-pill {
  position: absolute;
  bottom: 10px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(17, 24, 39, 0.88);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.live-dot-beacon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E7192D;
  box-shadow: 0 0 8px #E7192D;
  animation: beaconPulse 1.8s infinite;
}

.beacon-emerald {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.beacon-blue {
  background: #3b82f6;
  box-shadow: 0 0 8px #3b82f6;
}

@keyframes beaconPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.feature-card-body {
  padding: clamp(12px, 1.4vh, 18px) clamp(14px, 1.6vw, 20px);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  z-index: 2;
}

.feature-meta-kicker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.feature-kicker-cat {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #E7192D;
}

.feature-kicker-idx {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
}

.feature-card-title {
  font-family: var(--font-display);
  font-size: clamp(1.02rem, 1.2vw, 1.2rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
  margin: 0 0 6px;
}

.feature-card-desc {
  font-size: clamp(0.76rem, 0.82vw, 0.84rem);
  line-height: 1.5;
  color: #64748b;
  margin: 0 0 10px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feature-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
  gap: 10px;
}

.feature-tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.feature-tech-pill {
  background: #f1f5f9;
  color: #475569;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
}

.feature-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #E7192D;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  flex-shrink: 0;
  transition: gap 0.2s ease;
}

.feature-action-btn:hover {
  gap: 9px;
}

@media (max-width: 1024px) {
  .portfolio-showcase-section {
    height: auto;
    min-height: 100vh;
    max-height: none;
    overflow: visible;
    padding: 80px 20px;
  }
  .portfolio-showcase-header {
    flex-direction: column;
    gap: 16px;
  }
  .portfolio-showcase-deck {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 680px) {
  .portfolio-showcase-deck {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if 'Featured Portfolio Showcase Section' not in css:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'a', encoding='utf-8') as f:
        f.write(css_portfolio_addon)
    print("Appended Portfolio Showcase CSS to style.css.")
else:
    print("Portfolio Showcase CSS already in style.css.")

