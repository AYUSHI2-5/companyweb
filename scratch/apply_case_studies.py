# 1. Update style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

styles_to_add = """
/* ==========================================================================
   Portfolio Case Study Card Meta & Details Enhancement
   ========================================================================== */
.portfolio-case-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(13, 14, 16, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #FFFFFF;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 2;
}

.portfolio-industry-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #FFFFFF;
  color: #0D0E10;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.portfolio-card-kicker {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-red);
  margin-bottom: 8px;
}

.portfolio-meta-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
  font-size: 0.88rem;
  line-height: 1.5;
  margin-bottom: 18px;
  color: #4B5563;
  padding-bottom: 14px;
  border-bottom: 1px solid #F3F4F6;
}

.portfolio-meta-row .meta-label {
  font-weight: 700;
  color: #0D0E10;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.portfolio-case-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.case-detail-box {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 14px 16px;
  transition: border-color var(--transition-fast);
}

.case-detail-box.challenge-box {
  border-left: 3px solid #E7192D;
}

.case-detail-box.solution-box {
  border-left: 3px solid #10B981;
}

.detail-box-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.detail-box-icon {
  font-size: 0.75rem;
}

.challenge-box .detail-box-icon {
  color: #E7192D;
}

.solution-box .detail-box-icon {
  color: #10B981;
}

.detail-box-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #0D0E10;
}

.detail-box-text {
  font-size: 0.88rem;
  line-height: 1.55;
  color: #4B5563;
  margin: 0;
}

.portfolio-outcome-banner {
  background: rgba(231, 25, 45, 0.04);
  border: 1px solid rgba(231, 25, 45, 0.18);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #1F2937;
}

.outcome-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #E7192D;
  margin-right: 6px;
}

.portfolio-tech-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px solid #F3F4F6;
}

.tech-stack-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6B7280;
}

.portfolio-tech-footer .portfolio-card-tags {
  margin-bottom: 0;
}
"""

if '.portfolio-case-badge' not in css:
    target = ".portfolio-card-desc {\n  font-size: 0.95rem;\n  color: var(--text-muted);\n  line-height: 1.6;\n}"
    if target in css:
        css = css.replace(target, target + "\n" + styles_to_add)
    else:
        css += "\n" + styles_to_add
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added case study card styles to style.css")
else:
    print("Styles already present in style.css")

# 2. Update portfolio.html
portfolio_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Discover how BAADAM transforms business challenges into practical digital solutions through innovative technology, smart engineering and reliable IT services.">
  <title>Case Studies &amp; Portfolio | Baadam Info and Tradelink Services</title>
  <link rel="stylesheet" href="style.css">
  <link rel="icon" type="image/png" href="assets/baadam-logo.png">
</head>
<body>
  <!-- Floating Pill Navigation Bar -->
  <header class="site-header">
    <div class="nav-container">
      <a href="index.html" class="logo-link" aria-label="Baadam Home">
        <img src="assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="logo-img" width="140" height="38">
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
            <a href="index.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="services.html" class="nav-link">Services</a>
          </li>
          <li class="nav-item">
            <a href="portfolio.html" class="nav-link active">Portfolio</a>
          </li>
          <li class="nav-item">
            <a href="about.html" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a href="contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
        <div class="nav-cta-wrapper">
          <a href="contact.html" class="btn-talk" aria-label="Start a conversation">
            <span>Let's Talk</span>
            <span class="nav-arrow-circle" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="site-main">
    <!-- Page Hero -->
    <section class="page-hero">
      <div class="page-hero-container scroll-reveal">
        <div class="kicker-capsule">
          <i class="radar-dot" aria-hidden="true"></i>
          <span>Case Studies &middot; BAADAM</span>
        </div>
        <h1 class="page-title">
          Technology That Delivers.<br>
          <span class="text-brand-red">Results That Matter.</span>
        </h1>
        <p class="page-lead">
          Discover how BAADAM transforms business challenges into practical digital solutions through innovative technology, smart engineering and reliable IT services.
        </p>
      </div>
    </section>

    <!-- Portfolio Filter Bar & Grid -->
    <section class="section-pad">
      <div class="section-container">
        <!-- Interactive Category Filters -->
        <div class="portfolio-filter-bar scroll-reveal" role="tablist" aria-label="Filter portfolio by category">
          <button class="portfolio-filter-btn is-active" data-filter="all" type="button" role="tab" aria-selected="true">All Case Studies</button>
          <button class="portfolio-filter-btn" data-filter="web" type="button" role="tab" aria-selected="false">Web &amp; Websites</button>
          <button class="portfolio-filter-btn" data-filter="mobile" type="button" role="tab" aria-selected="false">Mobile Applications</button>
          <button class="portfolio-filter-btn" data-filter="cloud" type="button" role="tab" aria-selected="false">Cloud &amp; Infrastructure</button>
          <button class="portfolio-filter-btn" data-filter="ai" type="button" role="tab" aria-selected="false">AI &amp; Automation</button>
          <button class="portfolio-filter-btn" data-filter="enterprise" type="button" role="tab" aria-selected="false">Enterprise Software</button>
        </div>

        <!-- Case Studies 2-Column Grid -->
        <div class="portfolio-grid">
          <!-- Case Study 01 -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web enterprise">
            <div class="portfolio-card-media">
              <img src="assets/about-office.jpg" alt="Business Management Platform" class="portfolio-card-img" width="580" height="320">
              <div class="portfolio-case-badge">CASE STUDY 01</div>
              <div class="portfolio-industry-badge">Enterprise Technology</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">Web Application Development</div>
              <h2 class="portfolio-card-title">Business Management Platform</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">Custom Web Development, Backend Development, API Integration</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">Streamlining business operations and managing data across multiple processes.</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">Developed a centralized web application with an intuitive dashboard, automated workflows and integrated database management.</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">A unified platform designed to simplify operations and improve workflow efficiency.</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
                  <span class="portfolio-tag">React.js</span>
                  <span class="portfolio-tag">Python</span>
                  <span class="portfolio-tag">Django</span>
                  <span class="portfolio-tag">MySQL</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Case Study 02 -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web">
            <div class="portfolio-card-media">
              <img src="assets/hero-office.jpg" alt="Corporate Digital Presence" class="portfolio-card-img" width="580" height="320">
              <div class="portfolio-case-badge">CASE STUDY 02</div>
              <div class="portfolio-industry-badge">Professional Services</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">Corporate Website Development</div>
              <h2 class="portfolio-card-title">Corporate Digital Presence</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">Website Design, Frontend Development, Responsive Optimization</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">Creating a professional online presence with seamless navigation across devices.</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">Designed and developed a responsive, modern website with structured content and an intuitive user interface.</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">A modern digital experience with improved accessibility and usability.</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
                  <span class="portfolio-tag">HTML5</span>
                  <span class="portfolio-tag">CSS3</span>
                  <span class="portfolio-tag">JavaScript</span>
                  <span class="portfolio-tag">Bootstrap</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Case Study 03 -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="mobile">
            <div class="portfolio-card-media">
              <img src="assets/case-fitness-app.jpg" alt="Smart Mobile Application" class="portfolio-card-img" width="580" height="320">
              <div class="portfolio-case-badge">CASE STUDY 03</div>
              <div class="portfolio-industry-badge">Mobile Technology</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">Mobile Application Development</div>
              <h2 class="portfolio-card-title">Smart Mobile Application</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">Mobile App Development, API Integration, UI/UX Design</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">Providing users with convenient access to business services through mobile devices.</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">Developed a mobile-first application with user-friendly navigation and integrated backend services.</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">A streamlined mobile experience with centralized application functionality.</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
                  <span class="portfolio-tag">Flutter</span>
                  <span class="portfolio-tag">Firebase</span>
                  <span class="portfolio-tag">REST APIs</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Case Study 04 -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="cloud enterprise">
            <div class="portfolio-card-media">
              <img src="assets/cta-collaboration.jpg" alt="Cloud Infrastructure Modernization" class="portfolio-card-img" width="580" height="320">
              <div class="portfolio-case-badge">CASE STUDY 04</div>
              <div class="portfolio-industry-badge">Information Technology</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">Cloud &amp; Infrastructure Solutions</div>
              <h2 class="portfolio-card-title">Cloud Infrastructure Modernization</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">Cloud Deployment, Infrastructure Management, Performance Optimization</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">Improving application accessibility, scalability and infrastructure reliability.</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">Designed a cloud-ready infrastructure approach with optimized deployment and resource management.</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">A scalable infrastructure designed to support evolving business requirements.</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
                  <span class="portfolio-tag">AWS</span>
                  <span class="portfolio-tag">Linux</span>
                  <span class="portfolio-tag">Docker</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Case Study 05 -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="ai enterprise">
            <div class="portfolio-card-media">
              <img src="assets/about-digital-solutions.jpg" alt="Intelligent Business Automation" class="portfolio-card-img" width="580" height="320">
              <div class="portfolio-case-badge">CASE STUDY 05</div>
              <div class="portfolio-industry-badge">Artificial Intelligence</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">AI &amp; Automation</div>
              <h2 class="portfolio-card-title">Intelligent Business Automation</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">AI Integration, Workflow Automation, API Development</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">Reducing repetitive manual processes and improving access to business insights.</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">Integrated intelligent automation workflows and AI-powered functionality into existing business processes.</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">Improved workflow automation and more efficient information processing.</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
                  <span class="portfolio-tag">Python</span>
                  <span class="portfolio-tag">Machine Learning</span>
                  <span class="portfolio-tag">REST APIs</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Case Study 06 -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="enterprise web">
            <div class="portfolio-card-media">
              <img src="assets/hero-building.jpg" alt="Enterprise Management System" class="portfolio-card-img" width="580" height="320">
              <div class="portfolio-case-badge">CASE STUDY 06</div>
              <div class="portfolio-industry-badge">Enterprise Software</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">Enterprise Software Solutions</div>
              <h2 class="portfolio-card-title">Enterprise Management System</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">Software Development, Database Design, System Integration</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">Managing business information through disconnected tools and processes.</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">Developed a centralized software solution with structured data management, reporting and system integrations.</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">A unified software environment designed to support business operations.</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
                  <span class="portfolio-tag">Python</span>
                  <span class="portfolio-tag">Django</span>
                  <span class="portfolio-tag">PostgreSQL</span>
                  <span class="portfolio-tag">JavaScript</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Full-Width Agency CTA Banner -->
    <section class="section-pad cta-banner-section" aria-labelledby="cta-heading">
      <div class="section-container">
        <div class="cta-banner-card scroll-reveal">
          <div class="cta-banner-content">
            <div class="cta-banner-text">
              <div class="kicker-capsule">
                <span>[ NEXT STEPS ]</span>
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
              </div>
            </div>

            <div class="cta-banner-visual">
              <div class="cta-image-wrapper">
                <img src="assets/cta-collaboration.jpg" alt="Technical discovery and planning" class="cta-collab-img" width="460" height="280">
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
          <a href="index.html" class="logo-link" aria-label="Baadam Home">
            <img src="assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="footer-logo-img" width="140" height="38">
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
            <li><a href="index.html" class="footer-nav-link">Home</a></li>
            <li><a href="services.html" class="footer-nav-link">Services &amp; Capabilities</a></li>
            <li><a href="portfolio.html" class="footer-nav-link">Selected Work</a></li>
            <li><a href="about.html" class="footer-nav-link">About Company</a></li>
            <li><a href="contact.html" class="footer-nav-link">Contact Studio</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-col-title">Core Services</h3>
          <ul class="footer-link-list">
            <li><a href="services.html#web-dev" class="footer-nav-link">Website Development</a></li>
            <li><a href="services.html#app-dev" class="footer-nav-link">Application Development</a></li>
            <li><a href="services.html#software-dev" class="footer-nav-link">Software Engineering</a></li>
            <li><a href="services.html#marketing-seo" class="footer-nav-link">Digital Marketing &amp; SEO</a></li>
            <li><a href="services.html#ecommerce" class="footer-nav-link">E-Commerce Platforms</a></li>
            <li><a href="services.html#game-dev" class="footer-nav-link">Game Development</a></li>
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
            <li><a href="contact.html" class="footer-legal-link">Privacy Policy</a></li>
            <li class="legal-sep" aria-hidden="true">|</li>
            <li><a href="contact.html" class="footer-legal-link">Terms &amp; Conditions</a></li>
            <li class="legal-sep" aria-hidden="true">|</li>
            <li><a href="index.html" class="footer-legal-link">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <!-- Interactive Scripts -->
  <script src="main.js" defer></script>
</body>
</html>
"""

with open('portfolio.html', 'w', encoding='utf-8') as f:
    f.write(portfolio_content)

print("Updated portfolio.html successfully")

