with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

old_deck = """        <div class="portfolio-showcase-deck">
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
                <span>&#9733; 4.9 App Store Rating</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">Mobile Ecosystem</span>
                <span class="feature-kicker-idx">02</span>
              </div>
              <h3 class="feature-card-title">Smart Health &amp; Activity App</h3>
              <p class="feature-card-desc">
                Cross-platform mobile application with real-time biometric tracking, smart sensor telemetry, offline sync, and personalized coaching metrics.
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
                <span>&uarr; +180% Sales Growth</span>
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
        </div>"""

new_deck = """        <div class="portfolio-showcase-deck">
          <!-- Project 01: KP E-Services (FinTech & Loan Operations) -->
          <article class="portfolio-feature-card scroll-reveal" data-project="kpeservices">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">portal.kpeservices.com</span>
              </div>
              <div class="feature-media-overflow">
                <img src="assets/portfolio-hero-1.png" alt="KP E-Services Loan Operations Dashboard" class="feature-media-img" width="460" height="280">
              </div>
              <div class="feature-live-pill">
                <span class="live-dot-beacon"></span>
                <span>Automated Sanction &middot; Wallets</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">FinTech Platform</span>
                <span class="feature-kicker-idx">01</span>
              </div>
              <h3 class="feature-card-title">KP E-Services</h3>
              <p class="feature-card-desc">
                Comprehensive loan operations platform guiding applications from lead intake to disbursement with bank criteria, commission wallets, and document vaults.
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  <span class="feature-tech-pill">React.js</span>
                  <span class="feature-tech-pill">Node.js</span>
                  <span class="feature-tech-pill">Digital Wallets</span>
                </div>
                <a href="portfolio.html" class="feature-action-btn" aria-label="View KP E-Services Case Study">
                  <span>View Case</span>
                  <span class="feature-btn-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </article>

          <!-- Project 02: Chick N Go (Food Ordering Mobile Platform) -->
          <article class="portfolio-feature-card scroll-reveal" data-project="chickngo">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">order.chickngo.com</span>
              </div>
              <div class="feature-media-overflow">
                <img src="assets/portfolio-hero-2.png" alt="Chick N Go Online Food Ordering Application" class="feature-media-img" width="460" height="280">
              </div>
              <div class="feature-live-pill feature-live-pill-emerald">
                <span class="live-dot-beacon beacon-emerald"></span>
                <span>Live Kitchen Dispatch &middot; 0% Commission</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">Mobile &amp; Web App</span>
                <span class="feature-kicker-idx">02</span>
              </div>
              <h3 class="feature-card-title">Chick N Go</h3>
              <p class="feature-card-desc">
                Multi-tenant online food ordering platform and kitchen dispatch admin with multi-domain white-label capability and instant mobile checkout.
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  <span class="feature-tech-pill">Flutter / PWA</span>
                  <span class="feature-tech-pill">React.js</span>
                  <span class="feature-tech-pill">Payment Gateway</span>
                </div>
                <a href="portfolio.html" class="feature-action-btn" aria-label="View Chick N Go Case Study">
                  <span>View Case</span>
                  <span class="feature-btn-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </article>

          <!-- Project 03: Dodani ERP (Real Estate Back-Office) -->
          <article class="portfolio-feature-card scroll-reveal" data-project="dodanierp">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">internal.dodani.io/erp</span>
              </div>
              <div class="feature-media-overflow">
                <img src="assets/about-office-showcase.png" alt="Dodani ERP Real Estate Workspace" class="feature-media-img" width="460" height="280">
              </div>
              <div class="feature-live-pill feature-live-pill-blue">
                <span class="live-dot-beacon beacon-blue"></span>
                <span>Escrow Tracking &middot; Water Rights</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">Enterprise ERP</span>
                <span class="feature-kicker-idx">03</span>
              </div>
              <h3 class="feature-card-title">Dodani ERP</h3>
              <p class="feature-card-desc">
                Internal brokerage operations workspace orchestrating properties, offers, escrow stages, shared well water rights, and transaction vaults.
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  <span class="feature-tech-pill">Python / Django</span>
                  <span class="feature-tech-pill">PostgreSQL</span>
                  <span class="feature-tech-pill">AWS Vault</span>
                </div>
                <a href="portfolio.html" class="feature-action-btn" aria-label="View Dodani ERP Case Study">
                  <span>View Case</span>
                  <span class="feature-btn-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </article>
        </div>"""

norm_text = text.replace('\r\n', '\n')
norm_old_deck = old_deck.replace('\r\n', '\n')
norm_new_deck = new_deck.replace('\r\n', '\n')

assert norm_old_deck in norm_text, "old_deck not found in index.html"

new_text = norm_text.replace(norm_old_deck, norm_new_deck, 1)

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_text)

print("Successfully updated showcase deck in index.html!")

