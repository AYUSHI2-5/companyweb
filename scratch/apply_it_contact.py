import re

# 1. Update contact.html
contact_hero_and_form = """    <!-- Page Hero -->
    <section class="page-hero contact-page-hero">
      <div class="page-hero-container scroll-reveal">
        <div class="kicker-capsule">
          <i class="radar-dot" aria-hidden="true"></i>
          <span>Start a Project &middot; IT Consultation</span>
        </div>
        <h1 class="page-title">
          Let's Build Something<br>
          <span class="text-brand-red">Scalable &amp; Transformative.</span>
        </h1>
        <p class="page-lead">
          Have an upcoming software product, want to develop a mobile app, rebuild your web platform, or accelerate your digital marketing? Share your technical brief with our team in Ahmedabad.
        </p>

        <!-- 3 Key Trust Metrics for IT Clients -->
        <div class="contact-trust-bar">
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#9889;</span>
            <div class="trust-badge-text">
              <strong>24-Hour Response</strong>
              <span>Technical feasibility &amp; architect review</span>
            </div>
          </div>
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#128274;</span>
            <div class="trust-badge-text">
              <strong>100% NDA Protected</strong>
              <span>Strict IP &amp; data privacy guaranteed</span>
            </div>
          </div>
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#127919;</span>
            <div class="trust-badge-text">
              <strong>Flexible Engagements</strong>
              <span>Fixed milestones or dedicated squads</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form & Studio Details Grid -->
    <section class="section-pad contact-section-main" id="contact-main-section">
      <div class="section-container">
        <div class="contact-layout">
          <!-- Left: High-Conversion Interactive IT Project Form -->
          <div class="contact-form-wrap scroll-reveal">
            <div class="form-header-badge-row">
              <div class="kicker-capsule">
                <span>[ IT PROJECT SCOPE &amp; INQUIRY ]</span>
              </div>
              <span class="form-required-notice">* Required fields</span>
            </div>
            <h2 class="section-heading" style="font-size: 2.1rem; margin-bottom: 24px;">Tell Us About Your Project</h2>

            <div id="formStatusMsg" class="form-status" role="alert"></div>

            <form id="contactForm" class="contact-form" novalidate>
              <!-- Section 1: Contact Details -->
              <div class="form-fieldset">
                <span class="form-fieldset-title">01 / Contact Information</span>
                <div class="form-grid-2col">
                  <div class="form-group">
                    <label for="contactName" class="form-label">Full Name *</label>
                    <input type="text" id="contactName" name="name" class="form-input" placeholder="e.g. Rajesh Sharma" required>
                  </div>
                  <div class="form-group">
                    <label for="contactEmail" class="form-label">Work Email *</label>
                    <input type="email" id="contactEmail" name="email" class="form-input" placeholder="e.g. rajesh@company.com" required>
                  </div>
                </div>

                <div class="form-grid-2col">
                  <div class="form-group">
                    <label for="contactPhone" class="form-label">Phone / WhatsApp Number</label>
                    <input type="tel" id="contactPhone" name="phone" class="form-input" placeholder="e.g. +91 98765 43210">
                  </div>
                  <div class="form-group">
                    <label for="contactCompany" class="form-label">Company / Organization</label>
                    <input type="text" id="contactCompany" name="company" class="form-input" placeholder="e.g. NexaTech Innovations">
                  </div>
                </div>
              </div>

              <!-- Section 2: Services Required (Interactive Multi-Select Pills) -->
              <div class="form-fieldset">
                <span class="form-fieldset-title">02 / Services Required (Select all that apply)</span>
                <div class="service-pills-wrap" id="servicePillsGroup" role="group" aria-label="Select Services">
                  <button type="button" class="service-pill" data-value="Website Development">
                    <span class="pill-check">&#10003;</span> Website Development
                  </button>
                  <button type="button" class="service-pill" data-value="Mobile Application Development">
                    <span class="pill-check">&#10003;</span> Mobile App (iOS / Android)
                  </button>
                  <button type="button" class="service-pill" data-value="Custom Software & ERP">
                    <span class="pill-check">&#10003;</span> Software / ERP Development
                  </button>
                  <button type="button" class="service-pill" data-value="Digital Marketing & SEO">
                    <span class="pill-check">&#10003;</span> Digital Marketing &amp; SEO
                  </button>
                  <button type="button" class="service-pill" data-value="E-Commerce Development">
                    <span class="pill-check">&#10003;</span> E-Commerce Solutions
                  </button>
                  <button type="button" class="service-pill" data-value="Game Development">
                    <span class="pill-check">&#10003;</span> Game Development (Unity 3D)
                  </button>
                  <button type="button" class="service-pill" data-value="UI/UX Product Design">
                    <span class="pill-check">&#10003;</span> UI/UX Design &amp; Audit
                  </button>
                  <button type="button" class="service-pill" data-value="Cloud & DevOps">
                    <span class="pill-check">&#10003;</span> Cloud / API Integration
                  </button>
                </div>
                <input type="hidden" name="selectedServices" id="selectedServicesInput" value="">
              </div>

              <!-- Section 3: Project Scope, Budget & Timeline -->
              <div class="form-fieldset">
                <span class="form-fieldset-title">03 / Project Scope &amp; Budget</span>
                <div class="form-grid-2col">
                  <div class="form-group">
                    <label for="contactBudget" class="form-label">Estimated Budget</label>
                    <select id="contactBudget" name="budget" class="form-select">
                      <option value="" disabled selected>Select an investment range</option>
                      <option value="Under $5,000 (Under ₹3 Lakhs)">Under $5,000 (Under ₹3 Lakhs)</option>
                      <option value="$5,000 - $15,000 (₹3L - ₹10L)">$5,000 &ndash; $15,000 (₹3L &ndash; ₹10L)</option>
                      <option value="$15,000 - $35,000 (₹10L - ₹25L)">$15,000 &ndash; $35,000 (₹10L &ndash; ₹25L)</option>
                      <option value="$35,000+ (₹25L+)">$35,000+ (₹25L+)</option>
                      <option value="Flexible / Need Technical Scoping">Flexible / Need Scoping Call</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="contactTimeline" class="form-label">Target Launch Timeline</label>
                    <select id="contactTimeline" name="timeline" class="form-select">
                      <option value="" disabled selected>Select expected timeline</option>
                      <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                      <option value="1 - 3 Months">1 &ndash; 3 Months</option>
                      <option value="3 - 6 Months">3 &ndash; 6 Months</option>
                      <option value="Flexible / Ongoing Retainer">Flexible / Ongoing Retainer</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section 4: Project Brief & Message -->
              <div class="form-fieldset">
                <span class="form-fieldset-title">04 / Project Brief &amp; Technical Requirements *</span>
                <div class="form-group">
                  <textarea id="contactMessage" name="message" class="form-textarea" rows="5" placeholder="Describe your project vision, target audience, core features, existing systems, or technology preferences..." required></textarea>
                </div>

                <!-- NDA Request Checkbox -->
                <div class="form-checkbox-group">
                  <label class="custom-checkbox-label" for="ndaCheckbox">
                    <input type="checkbox" id="ndaCheckbox" name="ndaRequested" class="custom-checkbox-input">
                    <span class="custom-checkbox-box"></span>
                    <span class="custom-checkbox-text">
                      Please send a mutual <strong>Non-Disclosure Agreement (NDA)</strong> prior to detailed technical discussions.
                    </span>
                  </label>
                </div>
              </div>

              <button type="submit" class="btn-pill btn-primary-pill btn-submit-project" id="submitProjectBtn">
                <span>Submit Technical Inquiry</span>
                <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
              </button>
            </form>
          </div>

          <!-- Right: Studio Information, Direct Channels & FAQs -->
          <div class="contact-sidebar scroll-reveal">
            <!-- Studio HQ Card -->
            <div class="contact-info-card">
              <div class="contact-card-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div class="contact-card-content">
                <h3 class="contact-card-title">Development Studio HQ</h3>
                <p class="contact-card-text">
                  Ahmedabad, Gujarat, India.<br>
                  Monday &ndash; Saturday &middot; 9:30 AM &ndash; 6:30 PM IST
                </p>
                <div class="contact-card-badge">In-Person &amp; Remote Teams</div>
              </div>
            </div>

            <!-- Instant Communications Card -->
            <div class="contact-info-card">
              <div class="contact-card-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div class="contact-card-content">
                <h3 class="contact-card-title">Direct Inquiries</h3>
                <p class="contact-card-text">
                  Email: <a href="mailto:info@baadam.com" class="contact-accent-link">info@baadam.com</a><br>
                  Dedicated technical manager response within 24 hours.
                </p>
              </div>
            </div>

            <!-- Discovery Call Card -->
            <div class="contact-info-card contact-card-highlight">
              <div class="contact-card-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div class="contact-card-content">
                <h3 class="contact-card-title">Architectural Scoping Call</h3>
                <p class="contact-card-text">
                  Prefer a real-time discussion? Schedule a 20-minute video conference with our solutions architects to assess technical feasibility.
                </p>
                <a href="mailto:info@baadam.com?subject=Schedule%20Discovery%20Call" class="btn-discovery-link">
                  <span>Request Video Scoping Call</span>
                  <span class="btn-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <!-- Interactive IT FAQs Accordion -->
            <div class="contact-faq-wrap">
              <h3 class="contact-faq-heading">Frequently Asked Questions</h3>
              <div class="contact-faq-list">
                <!-- FAQ 1 -->
                <div class="contact-faq-item is-open">
                  <button type="button" class="contact-faq-btn" aria-expanded="true">
                    <span>How quickly can we start development?</span>
                    <span class="faq-icon" aria-hidden="true">&minus;</span>
                  </button>
                  <div class="contact-faq-panel">
                    <p>After technical scoping and milestone sign-off, our engineering team can onboard and launch Sprint 1 within 5 to 7 business days.</p>
                  </div>
                </div>

                <!-- FAQ 2 -->
                <div class="contact-faq-item">
                  <button type="button" class="contact-faq-btn" aria-expanded="false">
                    <span>Do you sign NDAs before discovery?</span>
                    <span class="faq-icon" aria-hidden="true">&plus;</span>
                  </button>
                  <div class="contact-faq-panel">
                    <p>Yes. We treat intellectual property with utmost security. Simply check the NDA box in the form and we will send a mutual agreement before discussing details.</p>
                  </div>
                </div>

                <!-- FAQ 3 -->
                <div class="contact-faq-item">
                  <button type="button" class="contact-faq-btn" aria-expanded="false">
                    <span>Who owns the source code and IP?</span>
                    <span class="faq-icon" aria-hidden="true">&plus;</span>
                  </button>
                  <div class="contact-faq-panel">
                    <p>You own 100% of all intellectual property, source code, database architectures, and design files upon milestone delivery and sign-off.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\contact.html', 'r', encoding='utf-8') as f:
    c_html = f.read()

# Replace from <!-- Page Hero --> through </section> of contact grid
pattern = r'<!-- Page Hero -->.*?<!-- Contact Form & Studio Details Grid -->.*?</section>'
new_c_html, count = re.subn(pattern, contact_hero_and_form.strip(), c_html, flags=re.DOTALL)

# Add cache-buster to style.css in contact.html
new_c_html = new_c_html.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css?v=5">')
new_c_html = new_c_html.replace('<script src="main.js" defer></script>', '<script src="main.js?v=3" defer></script>')

if count > 0:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\contact.html', 'w', encoding='utf-8') as f:
        f.write(new_c_html)
    print("Updated contact.html successfully.")
else:
    print("Pattern in contact.html not matched!")

# 2. Update style.css with IT Contact Page design
css_contact_addon = """
/* =====================================================================
   IT Company Contact Page Design System
   ===================================================================== */
.contact-page-hero {
  padding-top: 150px;
  padding-top: clamp(135px, 15vh, 175px);
  padding-bottom: 40px;
}

.contact-trust-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.trust-badge-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.trust-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(231, 25, 45, 0.08);
  border: 1px solid rgba(231, 25, 45, 0.18);
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.trust-badge-text {
  display: flex;
  flex-direction: column;
}

.trust-badge-text strong {
  font-family: var(--font-display, inherit);
  font-size: 0.94rem;
  font-weight: 700;
  color: #111827;
}

.trust-badge-text span {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.contact-section-main {
  background: #f8fafc;
  padding: 60px 0 100px;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: clamp(36px, 4vw, 56px);
  align-items: start;
}

.contact-form-wrap {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  padding: clamp(32px, 4vw, 48px);
  box-shadow: 0 10px 36px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02);
}

.form-header-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.form-required-notice {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: #94a3b8;
  letter-spacing: 0.04em;
}

.form-fieldset {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
}

.form-fieldset-title {
  font-family: var(--font-mono, monospace);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #E7192D;
}

.form-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.service-pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.service-pill {
  background: #f1f5f9;
  border: 1.5px solid transparent;
  border-radius: var(--radius-pill, 9999px);
  padding: 8px 16px;
  font-family: var(--font-sans, inherit);
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.service-pill .pill-check {
  font-size: 0.78rem;
  display: none;
}

.service-pill:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: translateY(-1px);
}

.service-pill.is-active {
  background: #E7192D;
  border-color: #E7192D;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(231, 25, 45, 0.28);
}

.service-pill.is-active .pill-check {
  display: inline;
}

.form-checkbox-group {
  margin-top: 14px;
}

.custom-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox-box {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
  margin-top: 2px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  display: grid;
  place-items: center;
}

.custom-checkbox-input:checked + .custom-checkbox-box {
  background: #E7192D;
  border-color: #E7192D;
  box-shadow: 0 0 0 3px rgba(231, 25, 45, 0.15);
}

.custom-checkbox-input:checked + .custom-checkbox-box::after {
  content: '✓';
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 800;
}

.custom-checkbox-text {
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.5;
}

.btn-submit-project {
  width: 100%;
  justify-content: center;
  padding: 16px 32px;
  font-size: 1rem;
  margin-top: 10px;
}

/* Sidebar styling */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.contact-card-badge {
  display: inline-block;
  margin-top: 10px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  font-weight: 700;
}

.contact-card-highlight {
  border-color: rgba(231, 25, 45, 0.25);
  background: linear-gradient(135deg, #ffffff 0%, #fff7f8 100%);
}

.btn-discovery-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: #E7192D;
  font-family: var(--font-mono, monospace);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: gap 0.2s ease;
}

.btn-discovery-link:hover {
  gap: 12px;
}

.contact-accent-link {
  color: #E7192D;
  font-weight: 600;
  text-decoration: underline;
}

/* FAQs */
.contact-faq-wrap {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.contact-faq-heading {
  font-family: var(--font-display, inherit);
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 18px;
}

.contact-faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-faq-item {
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.contact-faq-item.is-open {
  border-color: rgba(231, 25, 45, 0.25);
}

.contact-faq-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #fafafa;
  border: none;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.contact-faq-item.is-open .contact-faq-btn {
  background: #fff8f8;
  color: #E7192D;
}

.faq-icon {
  font-size: 1.1rem;
  font-weight: 800;
}

.contact-faq-panel {
  display: none;
  padding: 12px 16px 16px;
  background: #ffffff;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #64748b;
}

.contact-faq-item.is-open .contact-faq-panel {
  display: block;
}

@media (max-width: 992px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
  .contact-trust-bar {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .form-grid-2col {
    grid-template-columns: 1fr;
  }
}
"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if 'IT Company Contact Page Design System' not in css:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'a', encoding='utf-8') as f:
        f.write(css_contact_addon)
    print("Appended contact CSS to style.css.")
else:
    print("Contact CSS already in style.css.")

