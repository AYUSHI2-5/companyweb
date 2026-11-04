with open('about.html', 'r', encoding='utf-8') as f:
    html = f.read()

hero_start = '<!-- Page Hero -->'
hero_end = '<!-- Split Story Section -->'

new_hero = '''<!-- Page Hero -->
    <section class="page-hero about-page-hero" id="about-hero" aria-label="About Baadam Hero">
      <div class="section-container">
        <div class="about-hero-grid">
          <!-- Left Column: Content & Metrics -->
          <div class="about-hero-content scroll-reveal">
            <!-- Kicker Capsule -->
            <div class="kicker-capsule about-kicker">
              <i class="radar-dot" aria-hidden="true"></i>
              <span>ABOUT BAADAM</span>
            </div>

            <!-- Main Heading with Red Accent Line -->
            <h1 class="about-hero-heading">
              We Are Here For<br>
              <span class="text-brand-red">Make Best Product</span>
            </h1>
            <div class="about-title-accent" aria-hidden="true"></div>

            <!-- Subheading -->
            <p class="about-hero-subhead">
              We help you to create your Digital Presence to world.
            </p>

            <!-- Lead Paragraph -->
            <p class="about-hero-lead">
              Baadam Info And Trade Link Services Pvt. Ltd. uses cutting-edge technologies to design and develop apps, websites and software for your business growth. We have experienced team members to serve you dynamic, high-quality and customized services that take your business on top grade. Our experienced in-house team will help you strategize your business growth with their analytical skills. With an experience of five years, we create stunning websites and design brand identities that increase your business's sale growth. We are among the leading technology-based company that can reach you with all device compatibility.
            </p>

            <!-- 3 Stat / Trust Metric Badges with Dividers -->
            <div class="about-hero-trust-bar">
              <div class="about-trust-item">
                <div class="about-trust-icon-box" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="about-trust-text">
                  <strong>5+ Years</strong>
                  <span>Industry Experience</span>
                </div>
              </div>

              <div class="about-trust-divider" aria-hidden="true"></div>

              <div class="about-trust-item">
                <div class="about-trust-icon-box" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <div class="about-trust-text">
                  <strong>End-to-End</strong>
                  <span>Digital Solutions</span>
                </div>
              </div>

              <div class="about-trust-divider" aria-hidden="true"></div>

              <div class="about-trust-item">
                <div class="about-trust-icon-box" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB163C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div class="about-trust-text">
                  <strong>Trusted Partner</strong>
                  <span>for Business Growth</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Baadam Studio Office Visual -->
          <div class="about-hero-visual scroll-reveal">
            <div class="about-visual-stage">
              <img src="assets/about-office-showcase.png" 
                   alt="Baadam Info and Tradelink Services Studio Office in Ahmedabad" 
                   class="about-office-showcase-img" 
                   width="493" 
                   height="326" 
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
    with open('about.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('about.html hero updated successfully')
else:
    print('Hero start/end markers not found in about.html')

