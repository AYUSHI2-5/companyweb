with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# 1. Update tabs in index.html
old_tabs_block = """          <div class="case-tabs-track">
            <!-- Tab 1: Web App (Active) -->
            <button class="case-tab is-active" role="tab" aria-selected="true" data-client="case1" type="button">
              <img src="assets/about-office.jpg" alt="Business Management Platform" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Web Application</span>
                <span class="case-tab-stat">React &middot; Python</span>
              </div>
            </button>

            <!-- Tab 2: Corporate Website -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case2" type="button">
              <img src="assets/hero-office.jpg" alt="Corporate Digital Presence" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Corporate Website</span>
                <span class="case-tab-stat">HTML5 &middot; Bootstrap</span>
              </div>
            </button>

            <!-- Tab 3: Mobile App -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case3" type="button">
              <img src="assets/case-fitness-app.jpg" alt="Smart Mobile Application" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Mobile Application</span>
                <span class="case-tab-stat">Flutter &middot; Firebase</span>
              </div>
            </button>

            <!-- Tab 4: Cloud Solutions -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case4" type="button">
              <img src="assets/cta-collaboration.jpg" alt="Cloud Infrastructure Modernization" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Cloud Solutions</span>
                <span class="case-tab-stat">AWS &middot; Docker</span>
              </div>
            </button>

            <!-- Tab 5: AI & Automation -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case5" type="button">
              <img src="assets/about-digital-solutions.jpg" alt="Intelligent Business Automation" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">AI &amp; Automation</span>
                <span class="case-tab-stat">Python &middot; ML</span>
              </div>
            </button>

            <!-- Tab 6: Enterprise Software -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case6" type="button">
              <img src="assets/hero-building.jpg" alt="Enterprise Management System" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Enterprise Software</span>
                <span class="case-tab-stat">Django &middot; Postgres</span>
              </div>
            </button>
          </div>"""

new_tabs_block = """          <div class="case-tabs-track">
            <!-- Tab 1: KP E-Services (Active) -->
            <button class="case-tab is-active" role="tab" aria-selected="true" data-client="case1" type="button">
              <img src="assets/portfolio-hero-1.png" alt="KP E-Services Loan Operations" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">KP E-Services</span>
                <span class="case-tab-stat">FinTech &middot; Wallets</span>
              </div>
            </button>

            <!-- Tab 2: Ashray Labs -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case2" type="button">
              <img src="assets/case-dental-clinic.jpg" alt="Ashray Labs Diagnostics" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Ashray Labs</span>
                <span class="case-tab-stat">Healthcare &middot; Next.js</span>
              </div>
            </button>

            <!-- Tab 3: Chick N Go -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case3" type="button">
              <img src="assets/portfolio-hero-2.png" alt="Chick N Go Food Ordering" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Chick N Go</span>
                <span class="case-tab-stat">Food PWA &middot; Multi-Tenant</span>
              </div>
            </button>

            <!-- Tab 4: ProCurve -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case4" type="button">
              <img src="assets/about-office-mockup.jpg" alt="ProCurve Valuation Software" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">ProCurve</span>
                <span class="case-tab-stat">Valuation &middot; Python</span>
              </div>
            </button>

            <!-- Tab 5: Just Land -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case5" type="button">
              <img src="assets/hero-building.jpg" alt="Just Land Property Marketplace" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Just Land</span>
                <span class="case-tab-stat">PropTech &middot; Mapbox</span>
              </div>
            </button>

            <!-- Tab 6: Dodani ERP -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="case6" type="button">
              <img src="assets/about-office-showcase.png" alt="Dodani Brokerage ERP" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Dodani ERP</span>
                <span class="case-tab-stat">Escrow &middot; Django</span>
              </div>
            </button>
          </div>"""

# 2. Update default image in slider
old_slider_img = '<img src="assets/about-office.jpg" alt="Business Management Platform" class="case-img-after">'
new_slider_img = '<img src="assets/portfolio-hero-1.png" alt="KP E-Services Loan Platform" class="case-img-after">'

old_badge_text = '<span class="case-client-badge-text">Business Management Platform &middot; 2025</span>'
new_badge_text = '<span class="case-client-badge-text">KP E-Services &middot; FinTech Platform</span>'

norm_text = text.replace('\r\n', '\n')
norm_old_tabs = old_tabs_block.replace('\r\n', '\n')
norm_new_tabs = new_tabs_block.replace('\r\n', '\n')

assert norm_old_tabs in norm_text, "old_tabs_block not found in index.html"

norm_text = norm_text.replace(norm_old_tabs, norm_new_tabs, 1)
norm_text = norm_text.replace(old_slider_img, new_slider_img, 1)
norm_text = norm_text.replace(old_badge_text, new_badge_text, 1)

# Bump version in index.html
norm_text = norm_text.replace('style.css?v=27', 'style.css?v=28')
norm_text = norm_text.replace('main.js?v=27', 'main.js?v=28')
norm_text = norm_text.replace('case-study-slider.js', 'case-study-slider.js?v=28')

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(norm_text)

print("Successfully updated index.html tabs and slider!")

