with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    <!-- Core Values Section -->
    <section class="section-pad stats-section">'''

approach_section = '''    <!-- Dedicated Feature Section: Our Approach -->
    <section class="section-pad approach-section" id="our-approach" aria-labelledby="approach-heading">
      <div class="section-container">
        <!-- Section Header -->
        <div class="approach-header-wrap scroll-reveal">
          <div class="kicker-capsule">
            <i class="radar-dot" aria-hidden="true"></i>
            <span>Our Approach</span>
          </div>
          <h2 class="section-heading" id="approach-heading">
            We Are Here For <span class="text-brand-red">Make Best Services</span>
          </h2>
          <p class="approach-lead-text">
            We, Baadam Info And Trade Link Services Pvt. Ltd. a young yet experienced, dynamic, and technology-based company, are here to reduce your financial issues and increase your business's growth. Having an experience of five years, with more than thirty workers, we ensure an increase in traffic, high- quality software, and other related services. We are here to help new and digitally emerging companies. You can reach us by mobile, desktop as well as the laptop.
          </p>
        </div>

        <!-- 4 Interactive Approach Highlight Cards -->
        <div class="approach-cards-grid">
          <!-- Card 1: 5 Years & 30+ Workers -->
          <div class="approach-feature-card scroll-reveal">
            <div class="approach-card-header">
              <span class="approach-stat-pill">5+ YEARS &middot; 30+ WORKERS</span>
              <div class="approach-icon-circle" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
            <h3 class="approach-card-title">Experienced &amp; Dynamic Tech Team</h3>
            <p class="approach-card-desc">
              A united team of over thirty specialized developers, engineers, and digital marketers delivering proven results for half a decade.
            </p>
          </div>

          <!-- Card 2: Growth & Financial Relief -->
          <div class="approach-feature-card scroll-reveal">
            <div class="approach-card-header">
              <span class="approach-stat-pill">BUSINESS GROWTH</span>
              <div class="approach-icon-circle" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
            </div>
            <h3 class="approach-card-title">Reduce Financial Issues &amp; Scale</h3>
            <p class="approach-card-desc">
              We eliminate technical inefficiencies and costly overhead, optimizing your operations so your capital directly fuels measurable commercial expansion.
            </p>
          </div>

          <!-- Card 3: Traffic & Software Solutions -->
          <div class="approach-feature-card scroll-reveal">
            <div class="approach-card-header">
              <span class="approach-stat-pill">TRAFFIC &middot; QUALITY CODE</span>
              <div class="approach-icon-circle" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
              </div>
            </div>
            <h3 class="approach-card-title">High-Quality Software &amp; Traffic</h3>
            <p class="approach-card-desc">
              From enterprise-grade web and mobile applications to high-converting marketing campaigns, we ensure massive traffic surges and rock-solid software.
            </p>
          </div>

          <!-- Card 4: Multi-Device Universal Reach -->
          <div class="approach-feature-card approach-device-card scroll-reveal">
            <div class="approach-card-header">
              <span class="approach-stat-pill">OMNICHANNEL ACCESS</span>
              <div class="approach-device-icons">
                <span class="device-pill" title="Mobile"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Mobile</span>
                <span class="device-pill" title="Laptop"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg> Laptop</span>
                <span class="device-pill" title="Desktop"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Desktop</span>
              </div>
            </div>
            <h3 class="approach-card-title">Reach Us by Mobile, Desktop &amp; Laptop</h3>
            <p class="approach-card-desc">
              Whether you are on a phone, workstation, or laptop, our Ahmedabad studio is always accessible to support new and digitally emerging companies.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="section-pad stats-section">'''

target_norm = target.replace('\r\n', '\n')
content_norm = content.replace('\r\n', '\n')

if target_norm in content_norm:
    content_norm = content_norm.replace(target_norm, approach_section.replace('\r\n', '\n'))
    with open('about.html', 'w', encoding='utf-8') as f:
        f.write(content_norm)
    print('Inserted approach section into about.html successfully!')
else:
    print('Target not found in about.html')

