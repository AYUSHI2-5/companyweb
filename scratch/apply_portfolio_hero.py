with open('portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

hero_start = '<!-- Page Hero -->'
hero_end = '<!-- Portfolio Filter Bar & Grid -->'

new_hero = '''<!-- Page Hero -->
    <section class="page-hero portfolio-page-hero" id="portfolio-hero" aria-label="Portfolio Case Studies Hero">
      <div class="section-container">
        <div class="portfolio-hero-grid">
          <!-- Left Column: Content, Buttons & Capabilities -->
          <div class="portfolio-hero-content scroll-reveal">
            <!-- Kicker Capsule -->
            <div class="kicker-capsule portfolio-kicker">
              <i class="radar-dot" aria-hidden="true"></i>
              <span>CASE STUDIES &middot; BAADAM</span>
            </div>

            <!-- Main Heading -->
            <h1 class="portfolio-hero-heading">
              Technology That Delivers.<br>
              <span class="text-brand-red">Results That Matter.</span>
            </h1>

            <!-- Description -->
            <p class="portfolio-hero-desc">
              Discover how BAADAM transforms business challenges into practical digital solutions through innovative technology, smart engineering and reliable IT services.
            </p>

            <!-- Action CTAs -->
            <div class="portfolio-hero-actions">
              <a href="#portfolio-filters" class="btn-hero-primary" id="exploreWorkBtn">
                <span>Explore Our Work</span>
                <span class="btn-arrow" aria-hidden="true">&rarr;</span>
              </a>
              <a href="contact.html" class="btn-underline-link">
                <span>Discuss a Project</span>
              </a>
            </div>

            <!-- Bottom Capabilities Bar with Dividers -->
            <div class="portfolio-hero-trust-bar">
              <div class="portfolio-trust-item">
                <div class="portfolio-trust-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <div class="portfolio-trust-text">
                  <strong>Web &amp; App Development</strong>
                </div>
              </div>

              <div class="portfolio-trust-divider" aria-hidden="true"></div>

              <div class="portfolio-trust-item">
                <div class="portfolio-trust-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <div class="portfolio-trust-text">
                  <strong>UI/UX &amp; Branding</strong>
                </div>
              </div>

              <div class="portfolio-trust-divider" aria-hidden="true"></div>

              <div class="portfolio-trust-item">
                <div class="portfolio-trust-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div class="portfolio-trust-text">
                  <strong>IT Solutions</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Bento Grid Project Showcase Visual -->
          <div class="portfolio-hero-visual scroll-reveal">
            <div class="portfolio-visual-stage">
              <img src="assets/portfolio-hero-showcase.png" 
                   alt="Baadam Featured Project Mockups &amp; Dashboard Showcase" 
                   class="portfolio-showcase-img" 
                   width="513" 
                   height="424" 
                   loading="eager">
            </div>
          </div>
        </div>
      </div>
    </section>

    '''

idx1 = html.find(hero_start)
idx2 = html.find(hero_end)
if idx1 != -1 and idx2 != -1:
    html = html[:idx1] + new_hero + html[idx2:]
    # Also add id="portfolio-filters" to the section right below
    html = html.replace('<section class="section-pad">', '<section class="section-pad" id="portfolio-filters">')
    with open('portfolio.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('portfolio.html updated successfully with mockup hero')
else:
    print('Hero markers not found in portfolio.html')

