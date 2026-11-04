import re

new_services_html = '''            <h2 class="services-main-title" id="services-main-heading">
              Six core services.<br>
              <span class="lime-pill-tag">One</span> elite partner.
            </h2>
          </div>
          <div class="services-header-right">
            <p class="services-subtext">
              Website, application, digital marketing, e-commerce, custom software, and game development built with modern engineering and high-conversion design.
            </p>
            <a href="services.html" class="btn-all-services" aria-label="View all agency services">
              <span>All services</span>
              <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </div>

        <!-- Interactive Multi-Color Accordion Stack -->
        <div class="services-accordion-stack" role="region" aria-label="Services Catalog">

          <!-- Item 01: Website Development (White Pill) -->
          <article class="service-acc-item service-acc-white" data-index="1" data-name="Website Development">
            <button class="service-acc-header" type="button" aria-expanded="false" aria-controls="acc-body-1" id="acc-header-1">
              <div class="acc-header-left">
                <span class="acc-badge-index">01</span>
                <h3 class="acc-title">Website Development</h3>
              </div>
            </button>
            <div class="service-acc-body" id="acc-body-1" role="region" aria-labelledby="acc-header-1">
              <div class="acc-body-grid">
                <!-- Left: Web Performance Mockup -->
                <div class="mockup-viewport-card">
                  <div class="mockup-search-bar">
                    <svg class="mockup-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input class="mockup-search-input" type="text" value="full-stack website development" placeholder="full-stack website development|" aria-label="Search preview query" readonly>
                  </div>
                  <div class="mockup-search-meta">
                    Next.js &middot; React &middot; Headless CMS &middot; Edge Architecture
                  </div>
                  <div class="mockup-results-stack">
                    <div class="mockup-result-highlight">
                      <div class="mockup-res-info">
                        <span class="mockup-res-url"><span class="mockup-res-dot"></span> yourbrand.com &middot; Web Architecture</span>
                        <span class="mockup-res-title">60 FPS Responsive UI &middot; Sub-Second LCP Load Speed</span>
                      </div>
                      <span class="mockup-res-rank">99/100</span>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Mobile-First Responsive Framework &middot; Zero CLS</span>
                      <div class="skeleton-bar"></div>
                      <div class="skeleton-bar short"></div>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Modern Headless CMS &middot; API Integration</span>
                      <div class="skeleton-bar"></div>
                    </div>
                  </div>
                  <div class="mockup-floating-badge">
                    <span class="badge-dot-green" aria-hidden="true"></span>
                    <span>99/100 Web Vitals &middot; +280% Speed</span>
                    <span class="badge-dot-red" aria-hidden="true"></span>
                  </div>
                </div>

                <!-- Right: Specifications & Deliverables -->
                <div class="service-details-col">
                  <div>
                    <p class="service-pitch-text">
                      Bespoke, high-converting websites engineered with clean architecture, dynamic interactions, fluid mobile responsiveness, and sub-second load speeds.
                    </p>
                    <div class="deliverables-block">
                      <div class="deliverables-label">WHAT'S INCLUDED</div>
                      <ul class="deliverables-list">
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Custom UI/UX design &amp; Figma design system</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Next.js, React &amp; headless CMS integration</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Mobile-first fluid responsive layouts</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Interactive micro-animations &amp; physics</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Technical SEO &amp; 99+ Core Web Vitals optimization</li>
                      </ul>
                    </div>
                  </div>

                  <div class="service-footer-row">
                    <span class="service-metric-tag">&#9733; 99+ Speed Score</span>
                    <div class="service-price-wrap">
                      <span class="price-sublabel">FROM</span>
                      <span class="price-value">$1,800</span>
                    </div>
                    <a href="services.html" class="btn-explore-service">
                      <span>Explore</span>
                      <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Item 02: Application Development (Dark Pill) -->
          <article class="service-acc-item service-acc-dark" data-index="2" data-name="Application Development">
            <button class="service-acc-header" type="button" aria-expanded="false" aria-controls="acc-body-2" id="acc-header-2">
              <div class="acc-header-left">
                <span class="acc-badge-index">02</span>
                <h3 class="acc-title">Application Development</h3>
              </div>
            </button>
            <div class="service-acc-body" id="acc-body-2" role="region" aria-labelledby="acc-header-2">
              <div class="acc-body-grid">
                <!-- Left: Application Mockup -->
                <div class="mockup-viewport-card">
                  <div class="mockup-search-bar">
                    <span class="mockup-res-dot"></span>
                    <span style="font-weight:700; font-size:0.92rem; color:#111827;">Mobile &amp; Web App Suite &middot; iOS &amp; Android</span>
                  </div>
                  <div class="mockup-results-stack">
                    <div class="mockup-result-highlight" style="border-color:#24c875;">
                      <div class="mockup-res-info">
                        <span class="mockup-res-url">Flutter &amp; React Native &middot; Real-time Architecture</span>
                        <span class="mockup-res-title">Offline-First Sync, Biometric Auth &amp; Cloud DB</span>
                      </div>
                      <span class="mockup-res-rank" style="background:#24c875; color:#ffffff;">5.0 &#9733;</span>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">App Store &amp; Play Store Certified Architecture</span>
                      <div class="skeleton-bar" style="width:88%;"></div>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Real-Time Push Notification &amp; Event Engine</span>
                      <div class="skeleton-bar" style="width:70%;"></div>
                    </div>
                  </div>
                  <div class="mockup-floating-badge">
                    <span class="badge-dot-green" aria-hidden="true"></span>
                    <span>+450K Active App Sessions</span>
                    <span class="badge-dot-red" aria-hidden="true"></span>
                  </div>
                </div>

                <!-- Right: Specifications -->
                <div class="service-details-col">
                  <div>
                    <p class="service-pitch-text">
                      Native iOS, Android, and cross-platform apps built for high reliability, real-time data sync, intuitive user journeys, and seamless scalability.
                    </p>
                    <div class="deliverables-block">
                      <div class="deliverables-label">WHAT'S INCLUDED</div>
                      <ul class="deliverables-list">
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> iOS &amp; Android native &amp; Flutter/React Native builds</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Real-time WebSocket &amp; cloud database infrastructure</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Biometric authentication &amp; enterprise security</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Push notification &amp; event-driven analytics engine</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> App Store &amp; Google Play Store release management</li>
                      </ul>
                    </div>
                  </div>

                  <div class="service-footer-row">
                    <span class="service-metric-tag">&#9733; 99.98% Uptime</span>
                    <div class="service-price-wrap">
                      <span class="price-sublabel">FROM</span>
                      <span class="price-value">$2,800</span>
                    </div>
                    <a href="services.html" class="btn-explore-service">
                      <span>Explore</span>
                      <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Item 03: Digital Marketing (White Pill) -->
          <article class="service-acc-item service-acc-white" data-index="3" data-name="Digital Marketing">
            <button class="service-acc-header" type="button" aria-expanded="false" aria-controls="acc-body-3" id="acc-header-3">
              <div class="acc-header-left">
                <span class="acc-badge-index">03</span>
                <h3 class="acc-title">Digital Marketing</h3>
              </div>
            </button>
            <div class="service-acc-body" id="acc-body-3" role="region" aria-labelledby="acc-header-3">
              <div class="acc-body-grid">
                <!-- Left: Digital Marketing Mockup -->
                <div class="mockup-viewport-card">
                  <div class="mockup-search-bar">
                    <span class="mockup-res-dot"></span>
                    <span style="font-weight:700; font-size:0.92rem; color:#111827;">Omnichannel Growth Engine &middot; Active</span>
                  </div>
                  <div class="mockup-results-stack">
                    <div class="mockup-result-highlight" style="border-color:var(--brand-red);">
                      <div class="mockup-res-info">
                        <span class="mockup-res-url">Google Search, Meta Ads &amp; Technical SEO Funnel</span>
                        <span class="mockup-res-title">Cost Per Acquisition: $18.40 (-44%) &middot; 4.9x ROAS</span>
                      </div>
                      <span class="mockup-res-rank">4.9x ROAS</span>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">High-Intent Search Dominance &middot; #1 Rankings</span>
                      <div class="skeleton-bar" style="width:82%;"></div>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Behavioral Retargeting &amp; Email Automation Sequences</span>
                      <div class="skeleton-bar" style="width:66%;"></div>
                    </div>
                  </div>
                  <div class="mockup-floating-badge">
                    <span class="badge-dot-green" aria-hidden="true"></span>
                    <span>4.9x Average ROAS &middot; +340% Reach</span>
                    <span class="badge-dot-red" aria-hidden="true"></span>
                  </div>
                </div>

                <!-- Right: Specifications -->
                <div class="service-details-col">
                  <div>
                    <p class="service-pitch-text">
                      Data-driven multi-channel digital marketing uniting high-intent SEO, search advertising, social campaigns, and conversion copywriting to drive predictable revenue.
                    </p>
                    <div class="deliverables-block">
                      <div class="deliverables-label">WHAT'S INCLUDED</div>
                      <ul class="deliverables-list">
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Multi-channel campaign architecture (Google, Meta, LinkedIn)</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Technical SEO, keyword mapping &amp; link building</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> High-converting ad creatives &amp; persuasive copywriting</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Dynamic retargeting funnels &amp; automated email flows</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Real-time ROI analytics &amp; conversion attribution</li>
                      </ul>
                    </div>
                  </div>

                  <div class="service-footer-row">
                    <span class="service-metric-tag">&#9733; 4.9x Blended ROAS</span>
                    <div class="service-price-wrap">
                      <span class="price-sublabel">FROM</span>
                      <span class="price-value">$1,500/mo</span>
                    </div>
                    <a href="services.html" class="btn-explore-service">
                      <span>Explore</span>
                      <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Item 04: E-Commerce Development (Lime Pill) -->
          <article class="service-acc-item service-acc-lime" data-index="4" data-name="E-Commerce Development">
            <button class="service-acc-header" type="button" aria-expanded="false" aria-controls="acc-body-4" id="acc-header-4">
              <div class="acc-header-left">
                <span class="acc-badge-index">04</span>
                <h3 class="acc-title">E-Commerce Development</h3>
              </div>
            </button>
            <div class="service-acc-body" id="acc-body-4" role="region" aria-labelledby="acc-header-4">
              <div class="acc-body-grid">
                <!-- Left: E-Commerce Storefront Mockup -->
                <div class="mockup-viewport-card">
                  <div class="mockup-search-bar">
                    <span class="mockup-res-dot"></span>
                    <span style="font-weight:700; font-size:0.92rem; color:#111827;">Global E-Commerce Storefront &middot; Instant Checkout</span>
                  </div>
                  <div class="mockup-results-stack">
                    <div class="mockup-result-highlight" style="border-color:#D4FF3A;">
                      <div class="mockup-res-info">
                        <span class="mockup-res-url">Shopify Plus, WooCommerce &amp; Headless Commerce</span>
                        <span class="mockup-res-title">Frictionless Checkout, Multi-Currency &amp; Dynamic Upsells</span>
                      </div>
                      <span class="mockup-res-rank">+185% Cart CV</span>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Stripe, Apple Pay &amp; Global Gateway Integration</span>
                      <div class="skeleton-bar" style="width:84%;"></div>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Automated Inventory, Shipping &amp; ERP Synchronization</span>
                      <div class="skeleton-bar" style="width:62%;"></div>
                    </div>
                  </div>
                  <div class="mockup-floating-badge">
                    <span class="badge-dot-green" aria-hidden="true"></span>
                    <span>+185% Checkout Conversion</span>
                    <span class="badge-dot-red" aria-hidden="true"></span>
                  </div>
                </div>

                <!-- Right: Specifications -->
                <div class="service-details-col">
                  <div>
                    <p class="service-pitch-text">
                      Lightning-fast e-commerce platforms engineered for frictionless product discovery, instant 1-click checkouts, and maximum average order value.
                    </p>
                    <div class="deliverables-block">
                      <div class="deliverables-label">WHAT'S INCLUDED</div>
                      <ul class="deliverables-list">
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Custom Shopify Plus, WooCommerce &amp; Headless storefronts</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> 1-Click checkout &amp; multi-currency payment gateways</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Real-time inventory sync, ERP &amp; logistics integration</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Dynamic product recommendation &amp; upsell funnels</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Mobile conversion rate optimization (CRO)</li>
                      </ul>
                    </div>
                  </div>

                  <div class="service-footer-row">
                    <span class="service-metric-tag">&#9733; +185% Conversion Surge</span>
                    <div class="service-price-wrap">
                      <span class="price-sublabel">FROM</span>
                      <span class="price-value">$2,400</span>
                    </div>
                    <a href="services.html" class="btn-explore-service">
                      <span>Explore</span>
                      <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Item 05: Software Development (Dark Pill) -->
          <article class="service-acc-item service-acc-dark" data-index="5" data-name="Software Development">
            <button class="service-acc-header" type="button" aria-expanded="false" aria-controls="acc-body-5" id="acc-header-5">
              <div class="acc-header-left">
                <span class="acc-badge-index">05</span>
                <h3 class="acc-title">Software Development</h3>
              </div>
            </button>
            <div class="service-acc-body" id="acc-body-5" role="region" aria-labelledby="acc-header-5">
              <div class="acc-body-grid">
                <!-- Left: Enterprise Software Architecture Mockup -->
                <div class="mockup-viewport-card">
                  <div class="mockup-search-bar">
                    <span class="mockup-res-dot"></span>
                    <span style="font-weight:700; font-size:0.92rem; color:#111827;">Enterprise Cloud Architecture &middot; Distributed Microservices</span>
                  </div>
                  <div class="mockup-results-stack">
                    <div class="mockup-result-highlight" style="border-color:#24c875;">
                      <div class="mockup-res-info">
                        <span class="mockup-res-url">Custom SaaS, Enterprise ERP &amp; High-Throughput APIs</span>
                        <span class="mockup-res-title">High-Concurrency Cluster &middot; REST &amp; GraphQL Gateway</span>
                      </div>
                      <span class="mockup-res-rank" style="background:#24c875; color:#ffffff;">Sub-10ms</span>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Automated CI/CD Pipeline on AWS, GCP &amp; Kubernetes</span>
                      <div class="skeleton-bar" style="width:86%;"></div>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Enterprise Role-Based Access Control (RBAC) &amp; Data Encryption</span>
                      <div class="skeleton-bar" style="width:68%;"></div>
                    </div>
                  </div>
                  <div class="mockup-floating-badge">
                    <span class="badge-dot-green" aria-hidden="true"></span>
                    <span>10M+ Daily API Calls</span>
                    <span class="badge-dot-red" aria-hidden="true"></span>
                  </div>
                </div>

                <!-- Right: Specifications -->
                <div class="service-details-col">
                  <div>
                    <p class="service-pitch-text">
                      Tailored enterprise software, custom SaaS platforms, and resilient cloud architectures designed to automate critical workflows and scale to millions of users.
                    </p>
                    <div class="deliverables-block">
                      <div class="deliverables-label">WHAT'S INCLUDED</div>
                      <ul class="deliverables-list">
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Custom SaaS platform architecture &amp; MVP engineering</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Scalable backend microservices (Node.js, Python, Go)</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> RESTful &amp; GraphQL API gateway development</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Cloud infrastructure (AWS / GCP / Docker / Kubernetes)</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Automated CI/CD deployment &amp; 24/7 security monitoring</li>
                      </ul>
                    </div>
                  </div>

                  <div class="service-footer-row">
                    <span class="service-metric-tag">&#9733; 10M+ Daily API Calls</span>
                    <div class="service-price-wrap">
                      <span class="price-sublabel">FROM</span>
                      <span class="price-value">$3,500</span>
                    </div>
                    <a href="services.html" class="btn-explore-service">
                      <span>Explore</span>
                      <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Item 06: Game Development (Light Grey Pill) -->
          <article class="service-acc-item service-acc-light" data-index="6" data-name="Game Development">
            <button class="service-acc-header" type="button" aria-expanded="false" aria-controls="acc-body-6" id="acc-header-6">
              <div class="acc-header-left">
                <span class="acc-badge-index">06</span>
                <h3 class="acc-title">Game Development</h3>
              </div>
            </button>
            <div class="service-acc-body" id="acc-body-6" role="region" aria-labelledby="acc-header-6">
              <div class="acc-body-grid">
                <!-- Left: Game Engine Mockup -->
                <div class="mockup-viewport-card">
                  <div class="mockup-search-bar">
                    <span class="mockup-res-dot"></span>
                    <span style="font-weight:700; font-size:0.92rem; color:#111827;">Interactive Gaming Engine &middot; 2D / 3D / WebGL</span>
                  </div>
                  <div class="mockup-results-stack">
                    <div class="mockup-result-highlight" style="border-color:#DFE0D7;">
                      <div class="mockup-res-info">
                        <span class="mockup-res-url">Unity, Unreal Engine &amp; WebGL Interactive Canvas</span>
                        <span class="mockup-res-title">60 FPS Real-Time Physics, Shaders &amp; Spatial Audio</span>
                      </div>
                      <span class="mockup-res-rank">60 FPS Locked</span>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Low-Latency Multiplayer Networking &amp; Game Server Sync</span>
                      <div class="skeleton-bar" style="width:80%;"></div>
                    </div>
                    <div class="mockup-result-skeleton">
                      <span class="skeleton-url">Gamified Brand Experiences &amp; In-App Economy Mechanics</span>
                      <div class="skeleton-bar" style="width:58%;"></div>
                    </div>
                  </div>
                  <div class="mockup-floating-badge">
                    <span class="badge-dot-green" aria-hidden="true"></span>
                    <span>60 FPS WebGL &amp; Native 3D</span>
                    <span class="badge-dot-red" aria-hidden="true"></span>
                  </div>
                </div>

                <!-- Right: Specifications -->
                <div class="service-details-col">
                  <div>
                    <p class="service-pitch-text">
                      Immersive 2D and 3D games, gamified interactive web experiences, and mobile entertainment built with fluid physics, rich shaders, and addictive gameplay.
                    </p>
                    <div class="deliverables-block">
                      <div class="deliverables-label">WHAT'S INCLUDED</div>
                      <ul class="deliverables-list">
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Unity, Unreal Engine &amp; WebGL game development</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> High-fidelity 3D asset modeling, rigging &amp; animation</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Real-time multiplayer networking &amp; physics simulation</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Custom audio design, spatial soundscapes &amp; VFX</li>
                        <li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> Cross-platform publishing for Web, iOS, Android &amp; PC</li>
                      </ul>
                    </div>
                  </div>

                  <div class="service-footer-row">
                    <span class="service-metric-tag">&#9733; 60 FPS Locked Physics</span>
                    <div class="service-price-wrap">
                      <span class="price-sublabel">FROM</span>
                      <span class="price-value">$3,200</span>
                    </div>
                    <a href="services.html" class="btn-explore-service">
                      <span>Explore</span>
                      <span class="btn-arrow-circle" aria-hidden="true">&nearr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

        </div>

        <!-- Bottom Stepper Progress Indicator -->
        <div class="services-stepper-bar">
          <div class="acc-stepper-tracks" aria-label="Services Progress">
            <div class="acc-stepper-segment is-active" data-step="1"></div>
            <div class="acc-stepper-segment" data-step="2"></div>
            <div class="acc-stepper-segment" data-step="3"></div>
            <div class="acc-stepper-segment" data-step="4"></div>
            <div class="acc-stepper-segment" data-step="5"></div>
            <div class="acc-stepper-segment" data-step="6"></div>
          </div>
          <div class="acc-stepper-counter">
            <span class="stepper-badge">01 / 06</span>
            <span class="stepper-name">Website Development</span>
          </div>
        </div>'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '            <h2 class="services-main-title" id="services-main-heading">'
end_marker = '        <!-- Bottom Stepper Progress Indicator -->\n        <div class="services-stepper-bar">\n          <div class="acc-stepper-tracks" aria-label="Services Progress">\n            <div class="acc-stepper-segment is-active" data-step="1"></div>\n            <div class="acc-stepper-segment" data-step="2"></div>\n            <div class="acc-stepper-segment" data-step="3"></div>\n            <div class="acc-stepper-segment" data-step="4"></div>\n            <div class="acc-stepper-segment" data-step="5"></div>\n            <div class="acc-stepper-segment" data-step="6"></div>\n          </div>\n          <div class="acc-stepper-counter">\n            <span class="stepper-badge">01 / 06</span>\n            <span class="stepper-name">SEO</span>\n          </div>\n        </div>'

assert start_marker in html, 'start_marker not found'
assert end_marker in html, 'end_marker not found'

start_idx = html.find(start_marker)
end_idx = html.find(end_marker) + len(end_marker)

html = html[:start_idx] + new_services_html + html[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Successfully updated index.html with all 6 new service cards!')

