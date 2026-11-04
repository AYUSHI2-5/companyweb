# Update contact.html with the exact mockup hero
with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

hero_start = '<!-- Page Hero -->'
hero_end = '<!-- Contact Form & Studio Details Grid -->'

mockup_hero = '''<!-- Page Hero -->
    <section class="page-hero contact-page-hero" id="contact-hero" aria-label="Contact Baadam Hero">
      <div class="section-container">
        <div class="contact-hero-grid">
          <!-- Left Column: Content, Buttons & Trust Metrics -->
          <div class="contact-hero-content scroll-reveal">
            <!-- Kicker Capsule -->
            <div class="kicker-capsule contact-kicker">
              <i class="radar-dot" aria-hidden="true"></i>
              <span>IT CONSULTATION &middot; PRODUCT DEVELOPMENT &middot; DIGITAL GROWTH</span>
            </div>

            <!-- Main Heading with Red Accent Line -->
            <h1 class="contact-hero-heading">
              Let's Build Something<br>
              <span class="text-brand-red">Scalable &amp; Transformative.</span>
            </h1>
            <div class="contact-title-accent" aria-hidden="true"></div>

            <!-- Description -->
            <p class="contact-hero-desc">
              Turn your ideas into powerful digital solutions &mdash; from custom software and mobile apps to web platforms and digital marketing, with a trusted team in Ahmedabad.
            </p>

            <!-- Action CTAs -->
            <div class="contact-hero-actions">
              <a href="#contact-main-section" class="btn-hero-primary" id="startProjectBtn">
                <span>Start a Project</span>
                <span class="btn-arrow" aria-hidden="true">&rarr;</span>
              </a>
              <a href="services.html" class="btn-hero-secondary">
                <span>Explore Services</span>
              </a>
            </div>

            <!-- Trust Metrics Bar with Dividers -->
            <div class="contact-hero-trust-bar">
              <div class="hero-trust-item">
                <div class="hero-trust-icon-box" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div class="hero-trust-text">
                  <strong>48-Hour Response</strong>
                  <span>Quick feasibility &amp; architect review</span>
                </div>
              </div>

              <div class="hero-trust-divider" aria-hidden="true"></div>

              <div class="hero-trust-item">
                <div class="hero-trust-icon-box" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div class="hero-trust-text">
                  <strong>100% NDA Protected</strong>
                  <span>Strict IP &amp; data privacy</span>
                </div>
              </div>

              <div class="hero-trust-divider" aria-hidden="true"></div>

              <div class="hero-trust-item">
                <div class="hero-trust-icon-box" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="hero-trust-text">
                  <strong>Flexible Engagements</strong>
                  <span>Fixed milestones or dedicated squads</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Workspace 3D Visual -->
          <div class="contact-hero-visual scroll-reveal" aria-hidden="true">
            <div class="contact-visual-stage">
              <img src="assets/contact-hero-workspace.png" 
                   alt="Baadam Software Development &amp; Engineering Workspace" 
                   class="contact-workspace-img" 
                   width="564" 
                   height="428" 
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
    html = html[:idx1] + mockup_hero + html[idx2:]
    with open('contact.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('contact.html updated with mockup hero')
else:
    print('Hero start/end markers not found')

