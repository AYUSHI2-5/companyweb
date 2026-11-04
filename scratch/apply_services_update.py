import re

# 1. Update style.css
css_addition = """
/* =====================================================================
   Services Showcase Section (Reference Red & White 3x2 Grid)
   ===================================================================== */
.services-showcase-section {
  padding: clamp(64px, 8vh, 100px) 0 clamp(80px, 10vh, 120px);
  background: #f7f9fc;
  position: relative;
}

.services-showcase-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto clamp(40px, 5.5vh, 60px);
  padding: 0 20px;
}

.services-showcase-title {
  font-family: var(--font-display, inherit);
  font-size: clamp(34px, 4vw, 44px);
  font-weight: 800;
  color: #0b1528;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 16px;
}

.services-showcase-subtitle {
  font-size: clamp(14px, 1.05vw, 15.5px);
  line-height: 1.7;
  color: #556270;
  margin: 0 auto 16px;
  max-width: 760px;
}

.services-accent-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 14px;
}

.services-accent-svg {
  display: block;
}

.services-showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 2.5vw, 36px);
  align-items: stretch;
}

.service-showcase-card {
  background: #ffffff;
  border-radius: 20px;
  padding: clamp(38px, 4vw, 48px) clamp(24px, 2.4vw, 32px) clamp(36px, 3.8vw, 44px);
  text-align: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
  position: relative;
}

.service-showcase-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(235, 22, 60, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04);
  border-color: rgba(235, 22, 60, 0.25);
}

.service-badge-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.service-badge-circle {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: #fff0f2;
  box-shadow: 0 4px 16px rgba(235, 22, 60, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-badge-dot-1 {
  position: absolute;
  top: 5px;
  left: 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #eb163c;
}

.service-badge-dot-2 {
  position: absolute;
  bottom: 7px;
  right: 9px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #eb163c;
}

.service-card-icon {
  display: block;
}

.service-card-title {
  font-family: var(--font-display, inherit);
  font-size: clamp(20px, 1.55vw, 23px);
  font-weight: 700;
  color: #eb163c;
  line-height: 1.3;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}

.service-card-text {
  font-size: clamp(13px, 0.95vw, 14.5px);
  line-height: 1.72;
  color: #64748b;
  margin: 0;
  flex-grow: 1;
}

@media (max-width: 1024px) {
  .services-showcase-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 680px) {
  .services-showcase-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .service-showcase-card {
    padding: 32px 20px;
  }
}
"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

if '.services-showcase-section' not in css_content:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'a', encoding='utf-8') as f:
        f.write(css_addition)
    print("Appended CSS successfully.")
else:
    print("CSS already present.")

# 2. Update services.html
with open(r'c:\Users\Admin\Desktop\Baadam.com\services.html', 'r', encoding='utf-8') as f:
    html = f.read()

services_showcase_html = """    <!-- Our Services Section matching user reference design -->
    <section class="services-showcase-section" aria-labelledby="services-main-heading">
      <div class="section-container">
        <!-- Section Header -->
        <div class="services-showcase-header scroll-reveal">
          <h1 class="services-showcase-title" id="services-main-heading">Our Services</h1>
          <p class="services-showcase-subtitle">
            We develop website, application, software and games and provide all other services related to these. We provide all the benefits associated with digital marketing and E-commerce development.
          </p>
          <div class="services-accent-wrap" aria-hidden="true">
            <svg class="services-accent-svg" width="60" height="12" viewBox="0 0 60 12" fill="none">
              <path d="M2 8H24L30 2L36 8H58" stroke="#EB163C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- 6 Service Cards Grid (3x2) -->
        <div class="services-showcase-grid">
          <!-- Card 1: Website Development -->
          <article class="service-showcase-card scroll-reveal" id="web-dev">
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <svg class="service-card-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#eb163c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">Website<br>Development</h2>
            <p class="service-card-text">
              Baadam Info Services Pvt. Ltd. is a highly specialized team for website development and services. You will get the high performing web experiences that are digitally transformative, and it is designed to be user-friendly. Our team creates the best website, which will be fully functional, very secure and able to grow your business.
            </p>
          </article>

          <!-- Card 2: Application Development -->
          <article class="service-showcase-card scroll-reveal" id="app-dev">
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <svg class="service-card-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb163c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"></line>
                </svg>
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">Application<br>Development</h2>
            <p class="service-card-text">
              Our great application development services allow you to build the best B2B apps for a wide range of platforms. We are making the apps for mobile, web, smartwatch, desktop, AR and VR. Baadam Info Pvt. Ltd. simplifies your business complexities.
            </p>
          </article>

          <!-- Card 3: Digital Marketing -->
          <article class="service-showcase-card scroll-reveal" id="marketing-seo">
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <svg class="service-card-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb163c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 11 18-5v12L3 14v-3z"></path>
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                </svg>
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">Digital<br>Marketing</h2>
            <p class="service-card-text">
              Baadam Info Pvt. Ltd. provides you with the complete Digital Marketing services. It includes email and content marketing, search engine marketing, content marketing &amp; lead generation and many more awesome services. We also increase improvement up to 1000 times in website traffic, visitors, &amp; sources.
            </p>
          </article>

          <!-- Card 4: E-Commerce Development -->
          <article class="service-showcase-card scroll-reveal" id="ecommerce">
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <svg class="service-card-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb163c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">E-Commerce<br>Development</h2>
            <p class="service-card-text">
              Baadam Info Pvt. Ltd. enable your business to reach a broader customer base with our website development services. We scale up your online business very efficiently.
            </p>
          </article>

          <!-- Card 5: Software Development -->
          <article class="service-showcase-card scroll-reveal" id="software-dev">
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <svg class="service-card-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#eb163c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="7 8 3 12 7 16"></polyline>
                  <line x1="14" y1="5" x2="10" y2="19"></line>
                  <polyline points="17 8 21 12 17 16"></polyline>
                </svg>
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">Software<br>Development</h2>
            <p class="service-card-text">
              Invent, integrate, build and upgrade your ideas with our services at Baadam Info Pvt. Ltd. We help you to create high-quality software solutions and products. We deliver a broader range of software-related services.
            </p>
          </article>

          <!-- Card 6: Game Development -->
          <article class="service-showcase-card scroll-reveal" id="game-dev">
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <svg class="service-card-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#eb163c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="6"></rect>
                  <line x1="6" y1="12" x2="10" y2="12"></line>
                  <line x1="8" y1="10" x2="8" y2="14"></line>
                  <circle cx="15.5" cy="11" r="0.75" fill="#eb163c"></circle>
                  <circle cx="17.5" cy="13" r="0.75" fill="#eb163c"></circle>
                </svg>
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">Game<br>Development</h2>
            <p class="service-card-text">
              Our game development team is a highly expert in making 3D games and application using Unity 3D tool. We are making a game for various platforms like iPhone/Ipad and Androids. We support you from the initials to final support with the proper maintenance.
            </p>
          </article>
        </div>
      </div>
    </section>"""

# Replace from <!-- Page Hero --> through end of <!-- Services Deep-Dive Detailed Blocks -->
pattern = r'<!-- Page Hero -->.*?<!-- Services Deep-Dive Detailed Blocks -->.*?</section>\s*'
new_html, count = re.subn(pattern, services_showcase_html + '\n\n', html, flags=re.DOTALL)

if count > 0:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\services.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Updated services.html successfully ({count} replacement).")
else:
    print("Pattern in services.html not matched!")

