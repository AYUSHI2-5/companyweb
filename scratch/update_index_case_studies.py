with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Case Studies Section Header
old_header = """        <!-- Split Editorial Header -->
        <div class="case-header-split scroll-reveal">
          <div class="case-header-left">
            <div class="case-kicker-capsule">
              <span class="case-kicker-dot" aria-hidden="true"></span>
              <span>(03) Case studies</span>
            </div>
            <h2 class="case-main-title" id="case-studies-heading">
              Results you can<br>
              <span class="text-red-glow">count.</span>
            </h2>
          </div>
          <div class="case-header-right">
            <p class="case-subtext">
              Six clients, six channels, one habit: we report the number that pays the bills, before and after.
            </p>
            <a href="portfolio.html" class="btn-all-cases" aria-label="View all case studies">
              <span>All case studies</span>
              <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </div>"""

new_header = """        <!-- Split Editorial Header -->
        <div class="case-header-split scroll-reveal">
          <div class="case-header-left">
            <div class="case-kicker-capsule">
              <span class="case-kicker-dot" aria-hidden="true"></span>
              <span>(03) Case Studies</span>
            </div>
            <h2 class="case-main-title" id="case-studies-heading">
              Technology That Delivers.<br>
              <span class="text-red-glow">Results That Matter.</span>
            </h2>
          </div>
          <div class="case-header-right">
            <p class="case-subtext">
              Discover how BAADAM transforms business challenges into practical digital solutions through innovative technology, smart engineering and reliable IT services.
            </p>
            <a href="portfolio.html" class="btn-all-cases" aria-label="View all case studies">
              <span>All case studies</span>
              <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </div>"""

html = html.replace(old_header, new_header)

# 2. Update Tabs Track
old_tabs = """          <div class="case-tabs-track">
            <!-- Tab 1: Northside Dental (Active) -->
            <button class="case-tab is-active" role="tab" aria-selected="true" data-client="northside" type="button">
              <img src="assets/case-dental-clinic.jpg" alt="Northside Dental" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Northside Dental</span>
                <span class="case-tab-stat">4,200 &rarr; 38,900</span>
              </div>
            </button>

            <!-- Tab 2: Kettlebrook Coffee -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="kettlebrook" type="button">
              <img src="assets/case-coffee-roastery.jpg" alt="Kettlebrook Coffee" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Kettlebrook Coffee</span>
                <span class="case-tab-stat">8,100 &rarr; 96,400</span>
              </div>
            </button>

            <!-- Tab 3: Fitloop -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="fitloop" type="button">
              <img src="assets/case-fitness-app.jpg" alt="Fitloop" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Fitloop</span>
                <span class="case-tab-stat">1.4x &rarr; 6.2x</span>
              </div>
            </button>

            <!-- Tab 4: Haven Realty -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="haven" type="button">
              <img src="assets/about-digital-solutions.jpg" alt="Haven Realty" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Haven Realty</span>
                <span class="case-tab-stat">14 &rarr; 122</span>
              </div>
            </button>

            <!-- Tab 5: Lumen Skin -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="lumen" type="button">
              <img src="assets/case-dental-clinic.jpg" alt="Lumen Skin" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Lumen Skin</span>
                <span class="case-tab-stat">$18k &rarr; $142k</span>
              </div>
            </button>

            <!-- Tab 6: Orbit Legal -->
            <button class="case-tab" role="tab" aria-selected="false" data-client="orbit" type="button">
              <img src="assets/about-office.jpg" alt="Orbit Legal" class="case-tab-avatar" width="38" height="38">
              <div class="case-tab-info">
                <span class="case-tab-name">Orbit Legal</span>
                <span class="case-tab-stat">9 &rarr; 57</span>
              </div>
            </button>
          </div>"""

new_tabs = """          <div class="case-tabs-track">
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

html = html.replace(old_tabs, new_tabs)

# 3. Update Initial Card Content
old_card_content = """          <!-- Background Base Layer: AFTER (Full Color) -->
          <div class="case-layer-after" aria-hidden="true">
            <img src="assets/case-dental-clinic.jpg" alt="After treatment" class="case-img-after">
          </div>

          <!-- Clipped Overlay Layer: BEFORE (Grayscale) -->
          <div class="case-layer-before" aria-hidden="true">
            <img src="assets/case-dental-clinic.jpg" alt="Before treatment" class="case-img-before">
          </div>

          <!-- Draggable Split Divider Line & Knob Handle -->
          <div class="case-split-handle" aria-hidden="true">
            <div class="case-knob-circle">
              <div class="case-knob-arrows">
                <span>&lang;</span>
                <span>&rang;</span>
              </div>
            </div>
          </div>

          <!-- Top-Left Floating Badge -->
          <div class="case-overlay-badge case-overlay-top-left">
            <span class="badge-dot-pink" aria-hidden="true"></span>
            <span class="case-client-badge-text">Northside Dental &middot; 2025</span>
          </div>

          <!-- Top-Right Floating Metric Tag -->
          <div class="case-overlay-badge case-overlay-top-right">
            <span class="case-metric-label">ORGANIC VISITS A MONTH</span>
          </div>

          <!-- Bottom-Left BEFORE Metric Overlay -->
          <div class="case-metric-block-before">
            <span class="case-tag-before">BEFORE</span>
            <div class="case-before-num">4,200</div>
          </div>

          <!-- Bottom-Right AFTER Metric Overlay -->
          <div class="case-metric-block-after">
            <span class="case-tag-after">&bull; AFTER</span>
            <div class="case-after-num">38,900</div>
          </div>"""

new_card_content = """          <!-- Background Base Layer: AFTER (Full Color) -->
          <div class="case-layer-after" aria-hidden="true">
            <img src="assets/about-office.jpg" alt="Business Management Platform" class="case-img-after">
          </div>

          <!-- Clipped Overlay Layer: BEFORE (Grayscale) -->
          <div class="case-layer-before" aria-hidden="true">
            <img src="assets/about-office.jpg" alt="Business Management Platform" class="case-img-before">
          </div>

          <!-- Draggable Split Divider Line & Knob Handle -->
          <div class="case-split-handle" aria-hidden="true">
            <div class="case-knob-circle">
              <div class="case-knob-arrows">
                <span>&lang;</span>
                <span>&rang;</span>
              </div>
            </div>
          </div>

          <!-- Top-Left Floating Badge -->
          <div class="case-overlay-badge case-overlay-top-left">
            <span class="badge-dot-pink" aria-hidden="true"></span>
            <span class="case-client-badge-text">Business Management Platform &middot; 2025</span>
          </div>

          <!-- Top-Right Floating Metric Tag -->
          <div class="case-overlay-badge case-overlay-top-right">
            <span class="case-metric-label">SYSTEM EFFICIENCY &amp; DATA</span>
          </div>

          <!-- Bottom-Left BEFORE Metric Overlay -->
          <div class="case-metric-block-before">
            <span class="case-tag-before">BEFORE</span>
            <div class="case-before-num">Manual</div>
          </div>

          <!-- Bottom-Right AFTER Metric Overlay -->
          <div class="case-metric-block-after">
            <span class="case-tag-after">&bull; AFTER</span>
            <div class="case-after-num">Automated</div>
          </div>"""

html = html.replace(old_card_content, new_card_content)

# 4. Update Card Bottom Editorial
old_card_footer = """        <!-- Card Bottom Editorial & Action Row -->
        <div class="case-card-footer scroll-reveal">
          <div class="case-footer-left">
            <div class="case-meta-kicker">DENTAL CLINIC &middot; 2025</div>
            <h3 class="case-headline">
              From page 4 to the top 3 for &ldquo;dentist near me&rdquo;
            </h3>
          </div>

          <div class="case-footer-right">
            <p class="case-desc">
              A local SEO rebuild: 60 location pages, 180 reviews and a content plan for every treatment.
            </p>
            <div class="case-actions-row">
              <div class="case-tags-container">
                <span class="case-tag-pill">SEO</span>
                <span class="case-tag-pill">Content</span>
              </div>
              <a href="portfolio.html" class="btn-read-case case-cta-link" aria-label="Read full case study">
                <span>READ THE CASE</span>
                <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
              </a>
            </div>
          </div>
        </div>"""

new_card_footer = """        <!-- Card Bottom Editorial & Action Row -->
        <div class="case-card-footer scroll-reveal">
          <div class="case-footer-left">
            <div class="case-meta-kicker">CASE 01 &middot; ENTERPRISE TECHNOLOGY</div>
            <h3 class="case-headline">
              Centralized Business Operations &amp; Automated Workflows
            </h3>
          </div>

          <div class="case-footer-right">
            <p class="case-desc">
              Developed a centralized web application with an intuitive dashboard, automated workflows and integrated database management to streamline operations.
            </p>
            <div class="case-actions-row">
              <div class="case-tags-container">
                <span class="case-tag-pill">React.js</span>
                <span class="case-tag-pill">Python</span>
                <span class="case-tag-pill">Django</span>
                <span class="case-tag-pill">MySQL</span>
              </div>
              <a href="portfolio.html" class="btn-read-case case-cta-link" aria-label="Read full case study">
                <span>READ CASE STUDY</span>
                <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
              </a>
            </div>
          </div>
        </div>"""

html = html.replace(old_card_footer, new_card_footer)

# 5. Update Bottom CTA on index.html
old_cta = """              <div class="kicker-capsule">
                <span class="funnel-kicker-dot" aria-hidden="true"></span>
                <span>(05) Start a project</span>
              </div>
              <h2 class="cta-banner-heading" id="cta-heading">
                Let's Discuss Your<br>Next Digital Initiative.
              </h2>
              <p class="cta-banner-desc">
                Partner with our Ahmedabad engineering studio to craft modern software, launch scalable web platforms, or expand your market presence.
              </p>
              <div class="cta-banner-btn-wrap">
                <a href="contact.html" class="btn-pill btn-primary-pill" aria-label="Get in touch with Baadam">
                  <span>Start a Conversation</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>"""

new_cta = """              <div class="kicker-capsule">
                <span class="funnel-kicker-dot" aria-hidden="true"></span>
                <span>(05) Next Steps</span>
              </div>
              <h2 class="cta-banner-heading" id="cta-heading">
                Have a Technology<br>Challenge?
              </h2>
              <p class="cta-banner-desc">
                Let's turn your idea into a practical digital solution.
              </p>
              <div class="cta-banner-btn-wrap">
                <a href="contact.html" class="btn-pill btn-primary-pill" aria-label="Discuss Your Project">
                  <span>Discuss Your Project</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>"""

html = html.replace(old_cta, new_cta)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html case studies section and bottom CTA successfully")

