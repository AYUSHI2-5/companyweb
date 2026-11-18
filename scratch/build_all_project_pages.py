import os
import json
import re

with open('scratch/extracted_projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Rich feature and contextual data for all 16 projects
project_features_data = {
    'kp-e-services': [
        ('Multi-Tier Loan Origination', 'Automates end-to-end loan lifecycles from lead intake and pre-login data capture through to documentation, bank approval, and final disbursement.', '&#9881;'),
        ('Bank Criteria Algorithm', 'Evaluates real-time customer financial eligibility across multiple banking partners with dynamic lending parameter calculations.', '&#9733;'),
        ('Connector Commission Wallet', 'Enables real-time tracking of agent referral payouts, transaction ledgers, digital recharges, and automated payouts.', '&#128179;'),
        ('Document Vault & KYC Security', 'Enterprise-grade encryption for borrower identity proofs, salary slips, bank statements, and compliance audits.', '&#128274;')
    ],
    'ashray-labs': [
        ('Appointment & Phlebotomist Dispatch', 'Enables patients to schedule diagnostic tests at home or at collection centers with automated phlebotomist route dispatch.', '&#128197;'),
        ('Dynamic Test Package Catalog', 'Staff configure customized pathology profiles, health checkup bundles, and promotional seasonal packages.', '&#9783;'),
        ('Cloud Diagnostic Report Vault', 'Secure patient portal where individuals log in to view historical biomarkers, download official PDF reports, and access invoices.', '&#128196;'),
        ('Multi-City Operational Console', 'Administrative command center for test pricing, laboratory inventory, city-specific logistics, and campaign metrics.', '&#127758;')
    ],
    'procurve': [
        ('DCF & Income Approach Engine', 'Automated financial projection modeling with customizable discount rates, terminal growth assumptions, and sensitivity tables.', '&#128200;'),
        ('Market Multiple Modeling', 'Empowers registered valuers to apply comparable transaction multiples and listed peer parameters seamlessly.', '&#128202;'),
        ('Net Asset Value (NAV) Audits', 'Structured balance sheet revaluation sheets that balance asset appreciation, liability haircuts, and net worth calculations.', '&#9878;'),
        ('Cap-Table & Share Capital Vault', 'Comprehensive directory of equity structures, preferential shares, director holdings, and historical valuation drafts.', '&#128221;')
    ],
    'heart-foundation-and-research-institute': [
        ('Institutional Research Intake', 'Standardized submission pipeline for medical institutions, independent researchers, and private entities seeking review.', '&#128300;'),
        ('Reviewer Evaluation Workflows', 'Role-based administrative review boards with scorecards, revision requests, and ethics committee audit tracking.', '&#9745;'),
        ('Automated Compliance Notifications', 'Real-time email and in-app alerts notifying applicants as submissions advance through scrutiny and sanctioning.', '&#128276;'),
        ('Grant Archive & Reporting', 'Centralized cloud repository for research outcomes, whitepapers, clinical trials, and milestone expenditure audits.', '&#128194;')
    ],
    'vishan-institute-of-technology': [
        ('High-Conversion Course Catalog', 'Modern interactive academic portal showcasing degree curricula, faculty credentials, syllabus details, and online enrollment.', '&#127891;'),
        ('Batch & Timetable Scheduler', 'Staff scheduling console managing classrooms, lecture slots, faculty rotations, and statutory holiday calendars.', '&#128197;'),
        ('Cloud Digital E-Library', 'Integrated knowledge base providing students instant access to syllabus PDFs, academic journals, and recorded lectures.', '&#128218;'),
        ('Tuition Invoicing & Enrollment Log', 'Automated student billing module generating printable invoices, tracking fee installments, and recording course history.', '&#128176;')
    ],
    'chick-n-go': [
        ('Multi-Domain Headless Engine', 'Engineered architecture allowing a single unified frontend codebase to power independent restaurant domains seamlessly.', '&#127760;'),
        ('Dynamic Menu & Meal Customizer', 'Real-time ordering pipeline supporting dish variations, spice levels, combo upgrades, and instant cart calculation.', '&#127831;'),
        ('Multi-Gateway Checkout', 'Frictionless checkout experience integrated with Stripe and local payment channels with immediate SMS/Email receipts.', '&#128179;'),
        ('Kitchen Dispatch & Store Console', 'Back-office operations dashboard for real-time kitchen order dispatch, inventory toggle, and revenue reporting.', '&#128293;')
    ],
    'sunshine-wholesale': [
        ('Tiered B2B Wholesale Pricing', 'Gated buyer accounts with volume-based discount tiers, minimum order quantities (MOQ), and tax-exempt verification.', '&#128230;'),
        ('High-Volume Inventory Engine', 'Dynamic catalog management handling thousands of smoking accessory SKUs with instant search and attribute filtering.', '&#128269;'),
        ('SEO Wholesale Blog & Guides', 'Content publishing engine driving organic search visibility for distributor queries and Canadian retail shop owners.', '&#128221;'),
        ('Bulk Order Matrix & Wishlist', 'Accelerated bulk ordering grids allowing store owners to enter quantities across dozens of variants in a single click.', '&#128203;')
    ],
    'cyclical-beauty': [
        ('Shopify 2.0 Modular Architecture', 'Custom liquid sections tailored for mobile-first storytelling, ingredient breakdowns, and skin benefit showcases.', '&#127807;'),
        ('B2B Retailer Stockist Intake', 'Specialized onboarding page where boutique owners and retail chains submit wholesale stocking applications.', '&#128188;'),
        ('Interactive Store Locator', 'Integrated map locator directing shoppers to verified brick-and-mortar retail shops stocking the beauty line.', '&#128205;'),
        ('High-Speed Mobile D2C Checkout', 'Sub-second shopping bag with upsell modules, subscription refills, and seamless Shopify checkout.', '&#128722;')
    ],
    'lpg-booking': [
        ('Agent Booking Sheet Processing', 'High-throughput operations portal enabling field agents to register batches of consumer gas cylinder bookings.', '&#128293;'),
        ('Digital Recharge Wallet', 'Instant wallet recharge infrastructure with full transaction logs, deposit approvals, and balance alerts.', '&#128179;'),
        ('Post-Delivery Dispute Resolution', 'Ticketing workflow for raising delivery discrepancy issues, consumer complaints, and billing corrections.', '&#128736;'),
        ('Role-Based Staff Governance', 'Granular admin console managing territory managers, booking agents, role permissions, and compliance reports.', '&#128101;')
    ],
    'servizo': [
        ('On-Demand Service Directory', 'Dynamic catalog of home, commercial, and appliance repair services with custom pricing and duration estimates.', '&#128736;'),
        ('Dynamic Diagnostic Questionnaire', 'Configurable step-by-step diagnostic forms that capture customer service requirements before dispatch.', '&#10067;'),
        ('Warranty & Product Claim Desk', 'Dedicated workflow for customers and technicians to track product guarantee validity and submit warranty claims.', '&#128737;'),
        ('Vendor Fulfillment Console', 'Management panel for approving field technicians, updating job statuses, and calculating commission payouts.', '&#128104;&#8205;&#128295;')
    ],
    'just-land': [
        ('Geospatial Parcel Search', 'Interactive mapping interface allowing buyers to search acreage, zoning classifications, utilities, and road access.', '&#127757;'),
        ('FSBO & Agent Listing Hub', 'Dual listing pipeline supporting For-Sale-By-Owner property submissions alongside verified broker representations.', '&#127969;'),
        ('Buyer-Seller Direct Messaging', 'In-app secure messaging allowing prospective buyers to communicate directly with landowners and listing principals.', '&#128172;'),
        ('Granular Property Taxonomy CMS', 'Administrative classification engine for terrain types, water rights, mineral rights, and featured investment homes.', '&#128209;')
    ],
    'just-my-team': [
        ('Referral Code Onboarding Gate', 'Exclusive closed network requiring verified sponsor referral codes to unlock platform access and team downlines.', '&#128272;'),
        ('Downline Network Hierarchy', 'Visual downline tree showcasing team tiers, recruited agents, active transactions, and split commission modeling.', '&#128101;'),
        ('Private Pocket Deal Rooms', 'Internal marketplace where registered agents share confidential pre-market opportunities and off-market acreage.', '&#128273;'),
        ('Agent Notebook & Personal Log', 'Built-in private workspace for taking confidential client notes, setting deal reminders, and tracking goals.', '&#128221;')
    ],
    'realtybizhub': [
        ('Multi-Platform SaaS Showcase', 'Clean marketing architecture presenting an ecosystem of specialized real estate management tools in one site.', '&#128187;'),
        ('Interactive "Book a Demo" Funnel', 'Dynamic qualification form that segments commercial brokerages, residential teams, and solo agents into tailored demos.', '&#128197;'),
        ('PropTech Resource Center', 'High-authority blog and knowledge hub covering real estate tech trends, escrow compliance, and brokerage operations.', '&#128214;'),
        ('Whitelabel Branding Engine', 'Administrative CMS allowing marketing staff to customize platform sections, feature highlights, and brand assets.', '&#127912;')
    ],
    'dodani-erp': [
        ('End-to-End Escrow Pipeline', 'Comprehensive back-office tracker managing earnest money deposits, title commitments, appraisal deadlines, and closing.', '&#128203;'),
        ('Shared Well & Utility Vault', 'Specialized real estate database documenting shared water well agreements, power easements, and maintenance covenants.', '&#128167;'),
        ('Collaborative Task Calendar', 'Synchronized brokerage calendar with automated milestone alerts, inspection dates, and agent task assignments.', '&#128197;'),
        ('Audit Trail & Contextual Threads', 'Timestamped commenting system on every property record ensuring complete operational compliance and accountability.', '&#128172;')
    ],
    'arizona-land-investors': [
        ('Syndication Portfolio Simulator', 'Interactive investor interface modeling historical appreciation rates, projected yields, and capital repayment horizons.', '&#128200;'),
        ('Summit Conference Management', 'Public-facing event registration pipeline handling attendee credentials, speaker schedules, and VIP summit seating.', '&#127903;'),
        ('Private Escrow & Interest Tracker', 'Authenticated member console for monitoring open escrow holdings, capital allocations, and official distributions.', '&#128188;'),
        ('Investor Support & Consultation', 'Direct messaging channel connecting accredited private investors with syndication principals and land developers.', '&#128172;')
    ],
    'micro-matching': [
        ('Creator & Brand KYC Verification', 'Secure document onboarding workflow verifying creator audience authenticity and corporate brand tax filings.', '&#128100;'),
        ('Stripe Escrow Split Payouts', 'Automated campaign escrow holding brand funds and releasing milestone payments directly to creator bank accounts.', '&#128179;'),
        ('Coupon & Conversion Analytics', 'Granular performance tracking attributing discount code redemptions, CTRs, and ROI to specific influencer tiers.', '&#128202;'),
        ('Deliverable Milestone Approvals', 'Operations console where staff review submitted draft reels, sponsored posts, and story proofs before going live.', '&#9745;')
    ]
}

os.makedirs('projects', exist_ok=True)

total_created = 0
for idx, p in enumerate(projects):
    slug = p['slug']
    title = p['title']
    case_badge = p['case_badge']
    industry = p['industry'].replace('&amp;', '&')
    kicker = p['kicker']
    img_rel = p['img']
    services_text = p['services']
    challenge_text = p['challenge']
    solution_text = p['solution']
    outcome_text = p['outcome']
    tags = p['tags']
    
    # Navigation prev/next
    prev_p = projects[(idx - 1) % len(projects)]
    next_p = projects[(idx + 1) % len(projects)]
    
    features = project_features_data.get(slug, [
        ('Core Architecture', 'Engineered with robust data flow and clean separation of concerns.', '&#9881;'),
        ('Custom Workflows', 'Tailored to the exact operational needs of the organization.', '&#9733;'),
        ('Secure Cloud Deployment', 'Built on scalable cloud infrastructure with high availability.', '&#128274;'),
        ('Intuitive User Experience', 'Designed for conversion, engagement, and staff efficiency.', '&#128100;')
    ])
    
    # Generate feature cards HTML
    feature_cards_html = ""
    for f_title, f_desc, f_icon in features:
        feature_cards_html += f"""            <article class="project-feature-card">
              <div class="feature-card-icon" aria-hidden="true">{f_icon}</div>
              <h3 class="feature-card-title">{f_title}</h3>
              <p class="feature-card-text">{f_desc}</p>
            </article>\n"""
            
    # Generate tag badges HTML
    tags_html = "".join([f'<span class="project-tech-badge">{t}</span>' for t in tags])

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{title} case study by Baadam. {kicker} Built with modern engineering, high reliability, and scalable digital architecture.">
  <title>{title} | Case Study | Baadam IT Solutions</title>
  <link rel="stylesheet" href="../../style.css?v=30">
  <link rel="icon" type="image/png" href="../../assets/baadam-logo.png">
</head>
<body class="project-detail-page">
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
            <a href="../../services.html" class="nav-link">Services</a>
          </li>
          <li class="nav-item">
            <a href="../../portfolio.html" class="nav-link active">Portfolio</a>
          </li>
          <li class="nav-item">
            <a href="../../about.html" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a href="../../contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <a href="../../contact.html" class="btn-primary-pill" aria-label="Let's Talk">
          <span>Let's Talk</span>
          <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  </header>

  <main class="site-main">
    <!-- Breadcrumb Navigation Bar -->
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <div class="breadcrumb-container">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <a href="../../index.html" class="breadcrumb-link">Home</a>
          </li>
          <li class="breadcrumb-separator" aria-hidden="true">/</li>
          <li class="breadcrumb-item">
            <a href="../../portfolio.html" class="breadcrumb-link">Portfolio</a>
          </li>
          <li class="breadcrumb-separator" aria-hidden="true">/</li>
          <li class="breadcrumb-item active" aria-current="page">
            <span>{title}</span>
          </li>
        </ol>
        <a href="../../portfolio.html" class="breadcrumb-return-link">
          <span aria-hidden="true">&larr;</span> Back to All Projects
        </a>
      </div>
    </nav>

    <!-- Project Hero Header -->
    <section class="project-page-hero" aria-labelledby="project-title">
      <div class="project-hero-container">
        <a href="../../portfolio.html" class="project-back-link">
          <span aria-hidden="true">&larr;</span> Back to Portfolio
        </a>

        <div class="project-eyebrow-row">
          <span class="project-case-badge">{case_badge}</span>
          <span class="project-industry-badge">{industry}</span>
        </div>

        <h1 class="project-hero-title" id="project-title">{title}</h1>
        <p class="project-hero-kicker">{kicker}</p>

        <!-- Project Metadata Strip -->
        <div class="project-meta-strip">
          <div class="project-meta-item">
            <span class="project-meta-label">Client Platform</span>
            <span class="project-meta-val">{title}</span>
          </div>
          <div class="project-meta-item">
            <span class="project-meta-label">Industry Sector</span>
            <span class="project-meta-val">{industry}</span>
          </div>
          <div class="project-meta-item">
            <span class="project-meta-label">Services Delivered</span>
            <span class="project-meta-val">{services_text}</span>
          </div>
          <div class="project-meta-item">
            <span class="project-meta-label">Deployment Status</span>
            <span class="project-meta-val">Production &middot; Active</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Hero Visual Stage -->
    <section class="project-stage-section" aria-label="Project Visual Showcase">
      <div class="project-stage-wrap">
        <div class="project-stage-frame">
          <img src="../../{img_rel}" alt="{title} - Showcase" class="project-stage-img" width="1200" height="580">
          <div class="project-status-pill">
            <span class="project-status-dot" aria-hidden="true"></span>
            <span>Live Platform Showcase</span>
          </div>
        </div>
      </div>
    </section>

    <!-- The Challenge & Solution Story Grid -->
    <section class="project-story-section" aria-labelledby="story-heading">
      <div class="project-hero-container">
        <h2 class="visually-hidden" id="story-heading">Challenge and Solution Overview</h2>
        <div class="project-story-grid">
          <!-- Left: The Challenge -->
          <article class="project-story-card challenge-card">
            <div class="story-card-kicker">
              <span aria-hidden="true">&#9679;</span> The Challenge
            </div>
            <h3 class="story-card-title">Operational Friction &amp; Technical Bottlenecks</h3>
            <p class="story-card-body">{challenge_text}</p>
          </article>

          <!-- Right: The Solution -->
          <article class="project-story-card solution-card">
            <div class="story-card-kicker">
              <span aria-hidden="true">&#10003;</span> The Engineered Solution
            </div>
            <h3 class="story-card-title">Scalable Architecture &amp; Streamlined Workflows</h3>
            <p class="story-card-body">{solution_text}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Key Architecture & Feature Modules -->
    <section class="project-features-section" aria-labelledby="features-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">Key Capabilities</div>
          <h2 class="section-head-title" id="features-heading">Engineered System Modules</h2>
          <p class="section-head-sub">Modular components designed for high conversion, operational agility, and complete platform reliability.</p>
        </div>

        <div class="project-features-grid">
{feature_cards_html}        </div>
      </div>
    </section>

    <!-- Impact & Technology Stack Section -->
    <section class="project-impact-section" aria-labelledby="impact-heading">
      <div class="project-hero-container">
        <div class="project-impact-grid">
          <article class="impact-card">
            <h3 class="impact-card-title" id="impact-heading">Business Outcome &amp; Impact</h3>
            <p class="impact-card-text">{outcome_text}</p>
            <div class="portfolio-outcome-banner" style="margin-top: auto; padding: 16px 20px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px;">
              <span class="outcome-label" style="color: #059669; font-weight: 800;">Results Delivered:</span>
              <span class="outcome-text" style="color: #065f46; font-size: 0.9rem;">Validated in real-world commercial environments, generating sustainable business velocity.</span>
            </div>
          </article>

          <article class="impact-card">
            <h3 class="impact-card-title">Technology &amp; Infrastructure Stack</h3>
            <p class="impact-card-text">Built using modern enterprise libraries, secure APIs, responsive interface frameworks, and high-performance cloud databases.</p>
            <div class="project-tech-badges">
              {tags_html}
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Project Navigation Prev / Next Bar -->
    <nav class="project-navigation-bar" aria-label="Project Navigation">
      <div class="project-nav-inner">
        <a href="../{prev_p['slug']}/" class="nav-project-btn" aria-label="Previous project: {prev_p['title']}">
          <span aria-hidden="true">&larr;</span>
          <span>Previous: {prev_p['title']}</span>
        </a>

        <a href="../../portfolio.html" class="nav-project-btn" style="background: #FAFAFA;">
          <span>All Portfolio Projects</span>
        </a>

        <a href="../{next_p['slug']}/" class="nav-project-btn" aria-label="Next project: {next_p['title']}">
          <span>Next: {next_p['title']}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </nav>

    <!-- Section 8: Final CTA Banner -->
    <section class="section-pad cta-banner-section" aria-labelledby="cta-heading">
      <div class="section-container">
        <div class="cta-banner-card">
          <div class="cta-banner-content">
            <div class="cta-badge-pill">
              <span class="cta-pulse-dot" aria-hidden="true"></span>
              <span>START A COLLABORATION</span>
            </div>
            <h2 class="cta-banner-heading" id="cta-heading">
              Have a Project in Mind?<br>Let's Build It Together.
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
        </div>
      </div>
    </section>
  </main>

  <!-- Site Footer -->
  <footer class="site-footer" id="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="../../index.html" class="footer-logo-link" aria-label="Baadam Home">
            <img src="../../assets/baadam-logo.png" alt="BAADAM" class="footer-logo-img" width="140" height="38">
          </a>
          <p class="footer-brand-desc">
            Empowering modern businesses with high-conversion web platforms, native mobile applications, and strategic digital marketing solutions.
          </p>
        </div>

        <div class="footer-links-grid">
          <div class="footer-links-col">
            <h4 class="footer-col-title">Navigation</h4>
            <ul class="footer-links-list">
              <li><a href="../../index.html" class="footer-link">Home</a></li>
              <li><a href="../../services.html" class="footer-link">Services</a></li>
              <li><a href="../../portfolio.html" class="footer-link">Portfolio</a></li>
              <li><a href="../../about.html" class="footer-link">About Us</a></li>
              <li><a href="../../contact.html" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <div class="footer-links-col">
            <h4 class="footer-col-title">Core Services</h4>
            <ul class="footer-links-list">
              <li><a href="../../services/website-development/" class="footer-link">Website Development</a></li>
              <li><a href="../../services/application-development/" class="footer-link">App Development</a></li>
              <li><a href="../../services/digital-marketing/" class="footer-link">Digital Marketing</a></li>
              <li><a href="../../services.html#ecommerce" class="footer-link">E-Commerce</a></li>
              <li><a href="../../services.html#software-dev" class="footer-link">Custom Software</a></li>
            </ul>
          </div>

          <div class="footer-links-col">
            <h4 class="footer-col-title">Headquarters</h4>
            <address class="footer-address">
              612, J B Tower, Opp Doordarshan Kendra,<br>
              Thaltej, Ahmedabad, Gujarat 380054<br>
              <a href="tel:+917940000000" class="footer-contact-link">+91 (079) 4000-0000</a><br>
              <a href="mailto:info@baadam.com" class="footer-contact-link">info@baadam.com</a>
            </address>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">&copy; 2026 Baadam Info &amp; Tradelink Services Pvt Ltd. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="../../contact.html" class="footer-sublink">Privacy Policy</a>
          <span class="footer-dot-sep" aria-hidden="true">&bull;</span>
          <a href="../../contact.html" class="footer-sublink">Terms of Service</a>
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

  <script src="../../main.js?v=30" defer></script>
</body>
</html>
"""

    dir_path = os.path.join('projects', slug)
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, 'index.html')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    total_created += 1
    print(f"[{total_created}/16] Created {file_path}")

print(f"\nSUCCESS: All {total_created} project detail pages generated successfully!")

