import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Custom iOS, Android, and cross-platform mobile and web application development by Baadam in Ahmedabad. Flutter, React Native, offline-first sync, and enterprise cloud backends.">
  <title>Application Development Services | iOS, Android &amp; Web Apps | Baadam</title>
  <link rel="stylesheet" href="../../style.css?v=29">
  <link rel="icon" type="image/png" href="../../assets/baadam-logo.png">
</head>
<body class="service-detail-page">
  <!-- Floating Pill Navigation Bar -->
  <header class="site-header">
    <div class="nav-container">
      <a href="../../index.html" class="logo-link" aria-label="Baadam Home">
        <img src="../../assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="logo-img" width="140" height="38">
      </a>

      <!-- CSS + JS mobile menu toggle -->
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Toggle navigation">
      <label for="nav-toggle" class="nav-toggle-label" aria-label="Open menu">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </label>

      <!-- Navigation Links -->
      <nav class="nav-menu" aria-label="Main Navigation">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="../../index.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="../../services.html" class="nav-link active">Services</a>
          </li>
          <li class="nav-item">
            <a href="../../portfolio.html" class="nav-link">Portfolio</a>
          </li>
          <li class="nav-item">
            <a href="../../about.html" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a href="../../contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
        <div class="nav-cta-wrapper">
          <a href="../../contact.html" class="btn-talk" aria-label="Start a conversation">
            <span>Let's Talk</span>
            <span class="nav-arrow-circle" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </div>
  </header>

  <!-- Breadcrumb Navigation Bar -->
  <nav class="service-breadcrumb-nav" aria-label="Breadcrumb">
    <div class="section-container">
      <div class="breadcrumb-inner">
        <a href="../../services.html" class="breadcrumb-back-link">
          <span class="back-arrow">&larr;</span> Back to All Services
        </a>
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item"><a href="../../index.html">Home</a></li>
          <li class="breadcrumb-sep" aria-hidden="true">/</li>
          <li class="breadcrumb-item"><a href="../../services.html">Services</a></li>
          <li class="breadcrumb-sep" aria-hidden="true">/</li>
          <li class="breadcrumb-item active" aria-current="page">Application Development</li>
        </ol>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="site-main">
    <!-- =====================================================================
         Section 1: Hero
         ===================================================================== -->
    <section class="service-hero-section" aria-label="Application Development Overview">
      <div class="section-container">
        <div class="service-hero-grid">
          <!-- Left Column: Editorial Content -->
          <div class="service-hero-content scroll-reveal">
            <div class="kicker-capsule">
              <i class="radar-dot" aria-hidden="true"></i>
              <span>OUR SERVICES</span>
            </div>

            <h1 class="service-hero-heading">
              Custom Mobile &amp; Web Apps.<br>
              <span class="text-brand-red">Engineered for Daily Engagement.</span>
            </h1>

            <p class="service-hero-desc">
              From consumer-facing iOS and Android apps to internal business operations suites, Baadam engineers resilient, responsive, and intuitive applications that solve real operational challenges.
            </p>

            <div class="service-hero-actions">
              <a href="../../contact.html" class="btn-pill btn-primary-pill" aria-label="Start Your App Project">
                <span>Start Your Project</span>
                <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
              </a>
              <a href="#related-projects" class="btn-pill btn-glass-pill" aria-label="Explore Related App Work">
                <span>Explore Our Work</span>
                <span class="btn-arrow-circle" aria-hidden="true">&darr;</span>
              </a>
            </div>

            <div class="service-trust-bar">
              <div class="service-trust-pill">
                <span class="service-trust-dot"></span>
                <span>iOS &amp; Android Ecosystems</span>
              </div>
              <div class="service-trust-pill">
                <span class="service-trust-dot"></span>
                <span>60 FPS Fluid Hardware Acceleration</span>
              </div>
              <div class="service-trust-pill">
                <span class="service-trust-dot"></span>
                <span>Offline-First Cloud Sync</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive App Preview Showcase -->
          <div class="service-hero-visual scroll-reveal">
            <div class="service-preview-card">
              <div class="preview-chrome-bar" aria-hidden="true">
                <div class="preview-dots">
                  <span class="preview-dot red"></span>
                  <span class="preview-dot yellow"></span>
                  <span class="preview-dot green"></span>
                </div>
                <div class="preview-url-pill">App Store &middot; Google Play Suite</div>
              </div>
              <div class="preview-image-wrap">
                <img src="../../assets/portfolio-hero-2.png" alt="Baadam Mobile Application Showcase" width="580" height="340" loading="eager">
                <div class="preview-floating-badge">
                  <span class="badge-beacon-dot" aria-hidden="true"></span>
                  <span>Cross-Platform Ready &middot; Biometric Auth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 2: Introduction
         ===================================================================== -->
    <section class="service-intro-section" aria-labelledby="intro-heading">
      <div class="section-container">
        <div class="service-intro-grid scroll-reveal">
          <div class="service-intro-left">
            <div class="kicker-capsule">
              <span>[ STRATEGIC OVERVIEW ]</span>
            </div>
            <h2 class="section-heading" id="intro-heading">
              Transforming Complex Workflows Into Effortless Mobile Experiences
            </h2>
          </div>
          <div class="service-intro-right">
            <p>
              Mobile and web applications are the lifeblood of customer retention and operational agility. Users judge an application within seconds: sluggish navigation, confusing interactions, or battery-draining architectures immediately result in app abandonment and negative reviews.
            </p>
            <p>
              At Baadam Info and Tradelink Services, we build applications that combine fluid tactile UX with industrial-strength cloud architectures. Whether developing customer-facing digital ordering tools or multi-tier enterprise operations apps, we ensure your software functions smoothly in both high-speed cloud environments and challenging low-connectivity field conditions.
            </p>
          </div>
        </div>

        <!-- 3 Core Foundation Pillars -->
        <div class="intro-pillars-grid scroll-reveal">
          <div class="intro-pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
                <line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/>
              </svg>
            </div>
            <h3 class="pillar-title">Native-Grade Fluidity</h3>
            <p class="pillar-desc">
              Hardware-accelerated rendering at 60 FPS, responsive gesture ergonomics, and lightweight memory profiles that conserve device battery.
            </p>
          </div>

          <div class="intro-pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </div>
            <h3 class="pillar-title">Offline-First Sync</h3>
            <p class="pillar-desc">
              Intelligent local database storage and background sync engines that keep users productive even without continuous cellular coverage.
            </p>
          </div>

          <div class="intro-pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 class="pillar-title">Biometric Security</h3>
            <p class="pillar-desc">
              Fingerprint/FaceID integration, encrypted local token vaults, and secure HTTPS communications protecting sensitive business workflows.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 3: What We Deliver (6 Capability Cards)
         ===================================================================== -->
    <section class="service-deliverables-section" aria-labelledby="deliverables-heading">
      <div class="section-container">
        <div class="section-editorial-header scroll-reveal">
          <div class="kicker-capsule">
            <span>[ WHAT WE DELIVER ]</span>
          </div>
          <h2 class="section-heading" id="deliverables-heading">
            Comprehensive Application Development Capabilities
          </h2>
          <p class="section-subtext">
            End-to-end engineering covering mobile client apps, scalable cloud APIs, and administrative control panels.
          </p>
        </div>

        <div class="service-deliverables-grid">
          <!-- Capability 1 -->
          <article class="deliverable-feature-card scroll-reveal">
            <div class="deliverable-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
                <line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/>
              </svg>
            </div>
            <h3 class="deliverable-card-title">Cross-Platform Apps (Flutter &amp; React Native)</h3>
            <p class="deliverable-card-desc">
              Unified codebases delivering native-quality UI and near-native performance simultaneously across iOS and Android, substantially reducing development time and maintenance overhead.
            </p>
          </article>

          <!-- Capability 2 -->
          <article class="deliverable-feature-card scroll-reveal">
            <div class="deliverable-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"/>
              </svg>
            </div>
            <h3 class="deliverable-card-title">Native iOS &amp; Android Engineering</h3>
            <p class="deliverable-card-desc">
              Specialized Swift and Kotlin application engineering unlocking hardware sensors, camera feeds, Bluetooth peripherals, and high-performance background threads.
            </p>
          </article>

          <!-- Capability 3 -->
          <article class="deliverable-feature-card scroll-reveal">
            <div class="deliverable-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3 class="deliverable-card-title">Enterprise Operations &amp; Dispatch Portals</h3>
            <p class="deliverable-card-desc">
              Specialized mobile tools for field agents, inventory managers, inspectors, and delivery teams, connected in real time to your central administration ERP.
            </p>
          </article>

          <!-- Capability 4 -->
          <article class="deliverable-feature-card scroll-reveal">
            <div class="deliverable-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <h3 class="deliverable-card-title">Real-Time Sockets &amp; Push Notifications</h3>
            <p class="deliverable-card-desc">
              Instant transactional alerts, order milestone notifications, and peer-to-peer messaging powered by Firebase Cloud Messaging (FCM) and WebSockets.
            </p>
          </article>

          <!-- Capability 5 -->
          <article class="deliverable-feature-card scroll-reveal">
            <div class="deliverable-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <h3 class="deliverable-card-title">Digital Wallets &amp; In-App Payments</h3>
            <p class="deliverable-card-desc">
              Seamless checkout flows supporting Apple Pay, Google Pay, credit cards, digital prepaid wallets, and automated commission reconciliations.
            </p>
          </article>

          <!-- Capability 6 -->
          <article class="deliverable-feature-card scroll-reveal">
            <div class="deliverable-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 class="deliverable-card-title">App Store Optimization &amp; Release</h3>
            <p class="deliverable-card-desc">
              End-to-end guidance through Apple App Store and Google Play compliance standards, TestFlight beta staging, crash telemetry, and continuous production updates.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 4: Why Choose Baadam?
         ===================================================================== -->
    <section class="service-why-section" aria-labelledby="why-heading">
      <div class="section-container">
        <div class="section-editorial-header scroll-reveal">
          <div class="kicker-capsule">
            <span>[ WHY CHOOSE BAADAM ]</span>
          </div>
          <h2 class="section-heading" id="why-heading">
            Engineering Principles That Protect Your Investment
          </h2>
          <p class="section-subtext">
            Our application development combines user-centric design with robust backend engineering to ensure dependable day-in, day-out utility.
          </p>
        </div>

        <div class="why-baadam-grid">
          <!-- Value 1 -->
          <div class="why-baadam-card scroll-reveal">
            <span class="why-card-badge">TENET 01</span>
            <h3 class="why-card-title">Business-Focused Solutions</h3>
            <p class="why-card-desc">
              Every screen, feature, and flow is mapped directly to core business efficiency, user engagement, and measurable ROI.
            </p>
          </div>

          <!-- Value 2 -->
          <div class="why-baadam-card scroll-reveal">
            <span class="why-card-badge">TENET 02</span>
            <h3 class="why-card-title">Customized Development Approach</h3>
            <p class="why-card-desc">
              Bespoke architecture specifically built around your proprietary business workflows, existing APIs, and specific user personas.
            </p>
          </div>

          <!-- Value 3 -->
          <div class="why-baadam-card scroll-reveal">
            <span class="why-card-badge">TENET 03</span>
            <h3 class="why-card-title">Scalable &amp; Reliable Solutions</h3>
            <p class="why-card-desc">
              Serverless cloud endpoints and database clustering capable of supporting tens of thousands of concurrent active device connections.
            </p>
          </div>

          <!-- Value 4 -->
          <div class="why-baadam-card scroll-reveal">
            <span class="why-card-badge">TENET 04</span>
            <h3 class="why-card-title">Quality-Focused Execution</h3>
            <p class="why-card-desc">
              Rigorous manual and automated device testing across various screen resolutions, chipsets, and operating system versions.
            </p>
          </div>

          <!-- Value 5 -->
          <div class="why-baadam-card scroll-reveal">
            <span class="why-card-badge">TENET 05</span>
            <h3 class="why-card-title">Ongoing Support &amp; Evolution</h3>
            <p class="why-card-desc">
              Proactive app maintenance, timely updates for new iOS and Android releases, and ongoing performance and battery optimization.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 5: Our Process (6 Steps Timeline)
         ===================================================================== -->
    <section class="service-process-section" aria-labelledby="process-heading">
      <div class="section-container">
        <div class="section-editorial-header scroll-reveal">
          <div class="kicker-capsule">
            <span>[ DELIVERY FRAMEWORK ]</span>
          </div>
          <h2 class="section-heading" id="process-heading">
            Our Six-Step Application Delivery Process
          </h2>
          <p class="section-subtext">
            From initial user journey mapping to certified App Store release, we follow a transparent and iterative development roadmap.
          </p>
        </div>

        <div class="process-timeline-grid">
          <!-- Step 1 -->
          <div class="process-step-card scroll-reveal">
            <div class="process-step-header">
              <span class="process-step-pill">PHASE 01</span>
              <span class="process-step-order">01</span>
            </div>
            <h3 class="process-step-title">Scoping &amp; Requirements Engineering</h3>
            <p class="process-step-desc">
              Defining key functional requirements, hardware permissions, cloud integration points, and choosing the optimal framework (Native vs Cross-Platform).
            </p>
          </div>

          <!-- Step 2 -->
          <div class="process-step-card scroll-reveal">
            <div class="process-step-header">
              <span class="process-step-pill">PHASE 02</span>
              <span class="process-step-order">02</span>
            </div>
            <h3 class="process-step-title">Interactive UX Flows &amp; Prototype</h3>
            <p class="process-step-desc">
              Designing tactile screen flows, ergonomics, micro-interactions, and clickable prototype walkthroughs for stakeholder feedback.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="process-step-card scroll-reveal">
            <div class="process-step-header">
              <span class="process-step-pill">PHASE 03</span>
              <span class="process-step-order">03</span>
            </div>
            <h3 class="process-step-title">Core Mobile App Development</h3>
            <p class="process-step-desc">
              Building modular UI components, state management containers, hardware sensor integrations, and local caching engines.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="process-step-card scroll-reveal">
            <div class="process-step-header">
              <span class="process-step-pill">PHASE 04</span>
              <span class="process-step-order">04</span>
            </div>
            <h3 class="process-step-title">Cloud APIs &amp; Real-Time Integration</h3>
            <p class="process-step-desc">
              Connecting backend endpoints, push notification triggers, payment gateway SDKs, and automated token authentication.
            </p>
          </div>

          <!-- Step 5 -->
          <div class="process-step-card scroll-reveal">
            <div class="process-step-header">
              <span class="process-step-pill">PHASE 05</span>
              <span class="process-step-order">05</span>
            </div>
            <h3 class="process-step-title">Device Fleet Testing &amp; Security QA</h3>
            <p class="process-step-desc">
              Validating app behavior across multiple physical smartphone models, testing offline degradation, memory profiling, and edge states.
            </p>
          </div>

          <!-- Step 6 -->
          <div class="process-step-card scroll-reveal">
            <div class="process-step-header">
              <span class="process-step-pill">PHASE 06</span>
              <span class="process-step-order">06</span>
            </div>
            <h3 class="process-step-title">App Store Launch &amp; Monitoring</h3>
            <p class="process-step-desc">
              Submitting production builds to the Apple App Store and Google Play Store, managing certificates, and monitoring live telemetry.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 6: Technologies and Tools
         ===================================================================== -->
    <section class="service-tech-section" aria-labelledby="tech-heading">
      <div class="section-container">
        <div class="section-editorial-header scroll-reveal">
          <div class="kicker-capsule">
            <span>[ STACK &amp; TOOLING ]</span>
          </div>
          <h2 class="section-heading" id="tech-heading">
            Mobile Frameworks &amp; Tooling Supported
          </h2>
          <p class="section-subtext">
            We use industry-leading mobile technologies to ensure reliable performance across both iOS and Android.
          </p>
        </div>

        <div class="tech-badges-grid scroll-reveal">
          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">FL</div>
            <div>
              <div class="tech-badge-name">Flutter</div>
              <div class="tech-badge-role">Cross-Platform UI Engine</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">RN</div>
            <div>
              <div class="tech-badge-name">React Native</div>
              <div class="tech-badge-role">Hybrid Mobile Framework</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">SW</div>
            <div>
              <div class="tech-badge-name">Swift (iOS)</div>
              <div class="tech-badge-role">Native Apple Engineering</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">KT</div>
            <div>
              <div class="tech-badge-name">Kotlin (Android)</div>
              <div class="tech-badge-role">Native Android Development</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">FB</div>
            <div>
              <div class="tech-badge-name">Firebase</div>
              <div class="tech-badge-role">Auth, FCM &amp; Real-time DB</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">API</div>
            <div>
              <div class="tech-badge-name">GraphQL / REST</div>
              <div class="tech-badge-role">Efficient Data Delivery</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">DB</div>
            <div>
              <div class="tech-badge-name">SQLite &amp; PostgreSQL</div>
              <div class="tech-badge-role">Local &amp; Cloud Data Storage</div>
            </div>
          </div>

          <div class="tech-badge-item">
            <div class="tech-badge-icon" aria-hidden="true">GCP</div>
            <div>
              <div class="tech-badge-name">Google Cloud / AWS</div>
              <div class="tech-badge-role">Scalable Backend Infrastructure</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 7: Related Projects
         ===================================================================== -->
    <section class="service-projects-section" id="related-projects" aria-labelledby="related-heading">
      <div class="section-container">
        <div class="section-editorial-header scroll-reveal">
          <div class="kicker-capsule">
            <span>[ PROVEN WORK ]</span>
          </div>
          <h2 class="section-heading" id="related-heading">
            Related Application Projects &amp; Case Studies
          </h2>
          <p class="section-subtext">
            Explore live food ordering, logistics, and on-demand mobile applications engineered by the Baadam team.
          </p>
        </div>

        <div class="service-projects-grid">
          <!-- Related Project 1: Chick N Go -->
          <article class="service-project-card scroll-reveal">
            <div class="service-project-media">
              <img src="../../assets/portfolio-hero-2.png" alt="Chick N Go Food Ordering Mobile Application" class="service-project-img" width="400" height="220" loading="lazy">
              <div class="portfolio-case-badge">CASE STUDY 06</div>
            </div>
            <div class="service-project-body">
              <div class="service-project-kicker">Food &amp; Beverage E-Commerce</div>
              <h3 class="service-project-title">Chick N Go</h3>
              <p class="service-project-desc">
                A multi-tenant online food ordering mobile application and kitchen dispatch admin with real-time order tracking and multi-domain white-label capability.
              </p>
              <div class="service-project-tags">
                <span class="service-project-tag">Flutter / PWA</span>
                <span class="service-project-tag">React.js</span>
                <span class="service-project-tag">Live Dispatch</span>
              </div>
              <a href="../../portfolio.html" class="service-project-link">
                <span>View Case Details</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>

          <!-- Related Project 2: LPG Booking -->
          <article class="service-project-card scroll-reveal">
            <div class="service-project-media">
              <img src="../../assets/hero-office-rect.jpg" alt="LPG Booking Agent Operations Portal" class="service-project-img" width="400" height="220" loading="lazy">
              <div class="portfolio-case-badge">CASE STUDY 09</div>
            </div>
            <div class="service-project-body">
              <div class="service-project-kicker">Energy &amp; Utility Logistics</div>
              <h3 class="service-project-title">LPG Booking</h3>
              <p class="service-project-desc">
                An operations portal and digital wallet system for LPG booking agents, managing booking sheets, issue resolution, role-based controls, and recharge balances.
              </p>
              <div class="service-project-tags">
                <span class="service-project-tag">React Native</span>
                <span class="service-project-tag">Node.js</span>
                <span class="service-project-tag">Digital Wallets</span>
              </div>
              <a href="../../portfolio.html" class="service-project-link">
                <span>View Case Details</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>

          <!-- Related Project 3: Servizo -->
          <article class="service-project-card scroll-reveal">
            <div class="service-project-media">
              <img src="../../assets/case-fitness-app.jpg" alt="Servizo On-Demand Services System" class="service-project-img" width="400" height="220" loading="lazy">
              <div class="portfolio-case-badge">CASE STUDY 10</div>
            </div>
            <div class="service-project-body">
              <div class="service-project-kicker">On-Demand Services &amp; Marketplace</div>
              <h3 class="service-project-title">Servizo</h3>
              <p class="service-project-desc">
                An administration and dispatch system for an on-demand service business, managing customers, service categories, vendor onboarding, and warranty claims.
              </p>
              <div class="service-project-tags">
                <span class="service-project-tag">Flutter App</span>
                <span class="service-project-tag">Firebase</span>
                <span class="service-project-tag">Claims Engine</span>
              </div>
              <a href="../../portfolio.html" class="service-project-link">
                <span>View Case Details</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         Section 8: Final CTA
         ===================================================================== -->
    <section class="section-pad cta-banner-section" aria-labelledby="cta-heading">
      <div class="section-container">
        <div class="cta-banner-card scroll-reveal">
          <div class="cta-banner-content">
            <div class="cta-banner-text">
              <div class="kicker-capsule">
                <span>[ COLLABORATION ]</span>
              </div>
              <h2 class="cta-banner-heading" id="cta-heading">
                Let's Build Something<br>Exceptional Together.
              </h2>
              <p class="cta-banner-desc">
                Have an idea or a business challenge? Let's discuss how Baadam can help turn your vision into reality.
              </p>
              <div class="cta-banner-btn-wrap">
                <a href="../../contact.html" class="btn-pill btn-primary-pill" aria-label="Let's Talk">
                  <span>Let's Talk</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <div class="cta-banner-visual">
              <div class="cta-image-wrapper">
                <img src="../../assets/cta-collaboration.jpg" alt="Technical discovery and planning" class="cta-collab-img" width="460" height="280">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Site Footer -->
  <footer class="site-footer" id="site-footer" role="contentinfo">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col footer-col-brand">
          <a href="../../index.html" class="logo-link" aria-label="Baadam Home">
            <img src="../../assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="footer-logo-img" width="140" height="38">
          </a>
          <p class="footer-brand-desc">
            Turning bold ideas into scalable digital solutions through strategy, design, and reliable software engineering.
          </p>
          <div class="footer-social-links" aria-label="Social Media Links">
            <a href="https://linkedin.com" class="footer-social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="https://instagram.com" class="footer-social-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="mailto:info@baadam.com" class="footer-social-btn" aria-label="Direct Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h3 class="footer-col-title">Navigation</h3>
          <ul class="footer-link-list">
            <li><a href="../../index.html" class="footer-nav-link">Home</a></li>
            <li><a href="../../services.html" class="footer-nav-link">Services &amp; Capabilities</a></li>
            <li><a href="../../portfolio.html" class="footer-nav-link">Selected Work</a></li>
            <li><a href="../../about.html" class="footer-nav-link">About Company</a></li>
            <li><a href="../../contact.html" class="footer-nav-link">Contact Studio</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col-title">Core Services</h3>
          <ul class="footer-link-list">
            <li><a href="../../services/website-development/" class="footer-nav-link">Website Development</a></li>
            <li><a href="../../services/application-development/" class="footer-nav-link">Application Development</a></li>
            <li><a href="../../services/digital-marketing/" class="footer-nav-link">Digital Marketing &amp; SEO</a></li>
            <li><a href="../../services.html#ecommerce" class="footer-nav-link">E-Commerce Platforms</a></li>
            <li><a href="../../services.html#software-dev" class="footer-nav-link">Software Engineering</a></li>
            <li><a href="../../services.html#game-dev" class="footer-nav-link">Game Development</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col-title">Headquarters</h3>
          <ul class="footer-contact-list">
            <li class="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Ahmedabad, Gujarat, India</span>
            </li>
            <li class="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <a href="mailto:info@baadam.com" class="footer-nav-link">info@baadam.com</a>
            </li>
            <li class="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Mon &ndash; Sat: 9:30 AM &ndash; 6:30 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div class="footer-bottom-container">
          <p class="footer-copyright">
            &copy; 2026 Baadam Info and Trade Link Services Pvt. Ltd. All rights reserved.
          </p>
          <ul class="footer-legal-links" aria-label="Legal Links">
            <li><a href="../../contact.html" class="footer-legal-link">Privacy Policy</a></li>
            <li class="legal-sep" aria-hidden="true">|</li>
            <li><a href="../../contact.html" class="footer-legal-link">Terms &amp; Conditions</a></li>
            <li class="legal-sep" aria-hidden="true">|</li>
            <li><a href="../../index.html" class="footer-legal-link">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <!-- Teacher Avatar Guide (Bottom-Left) -->
  <aside class="teacher-guide-widget" id="teacherGuideWidget" aria-label="Baadam Presentation Guide">
    <div class="teacher-avatar-wrapper" id="teacherAvatarWrapper">
      <div class="teacher-arm-layer" id="teacherArmLayer">
        <div class="teacher-wrist-layer" id="teacherWristLayer">
          <img src="../../assets/teacher-pointing-arm.png?v=10" alt="" class="teacher-arm-img" id="teacherArmImg" width="150" height="195">
        </div>
      </div>
      <img src="../../assets/teacher-pointing-body.png?v=10" alt="Baadam Presentation Guide" class="teacher-body-layer" id="teacherBodyLayer" width="150" height="195">
    </div>
  </aside>

  <!-- Interactive Scripts -->
  <script src="../../main.js?v=29" defer></script>
</body>
</html>
"""

with open('services/application-development/index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(html_content)

print("Successfully created services/application-development/index.html!")

