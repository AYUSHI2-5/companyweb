with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

with open('scratch/found_deck.txt', 'r', encoding='utf-8') as f:
    found_deck = f.read()

new_deck = """<div class="portfolio-showcase-deck">
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
        </div>
      </div>
    </section>"""

assert found_deck in text, "found_deck not in text"
new_text = text.replace(found_deck, new_deck, 1)

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_text)

print("Successfully replaced showcase deck in index.html!")

