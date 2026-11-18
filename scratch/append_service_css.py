service_detail_css = """
/* ==========================================================================
   22. Dedicated Service Detail Pages Framework
   Clean, modern, premium IT company aesthetic matching Baadam brand identity
   ========================================================================== */

/* Breadcrumb Navigation */
.service-breadcrumb-nav {
  background: #ffffff;
  border-bottom: 1px solid var(--border-subtle);
  padding: 14px 24px;
  position: relative;
  z-index: 10;
  margin-top: var(--header-height);
}

.breadcrumb-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.breadcrumb-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--brand-red);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: var(--brand-red-light);
  border: 1px solid var(--brand-red-border);
  transition: all var(--transition-fast);
}

.breadcrumb-back-link:hover {
  background: var(--brand-red);
  color: #ffffff;
  transform: translateX(-3px);
  box-shadow: 0 4px 14px rgba(231, 25, 45, 0.25);
}

.breadcrumb-back-link .back-arrow {
  transition: transform var(--transition-fast);
  font-size: 0.95rem;
}

.breadcrumb-back-link:hover .back-arrow {
  transform: translateX(-3px);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.84rem;
  color: var(--text-muted);
}

.breadcrumb-item a {
  color: var(--text-fog);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.breadcrumb-item a:hover {
  color: var(--brand-red);
}

.breadcrumb-item.active {
  color: var(--text-pure);
  font-weight: 600;
}

.breadcrumb-sep {
  color: var(--text-dim);
  font-size: 0.75rem;
}

/* Service Detail Hero Section */
.service-hero-section {
  background: linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%);
  padding: 48px 24px 64px;
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
  overflow: hidden;
}

.service-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 48px;
  align-items: center;
}

.service-hero-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.service-hero-heading {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 3.8vw, 3.4rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: var(--text-pure);
  margin: 0;
}

.service-hero-desc {
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  color: var(--text-fog);
  line-height: 1.65;
  max-width: 620px;
  margin: 0;
}

.service-hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.service-trust-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 18px;
  border-top: 1px solid var(--border-subtle);
}

.service-trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-chalk);
}

.service-trust-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand-red);
  box-shadow: 0 0 6px rgba(231, 25, 45, 0.6);
}

/* Service Hero Visual Frame */
.service-hero-visual {
  position: relative;
}

.service-preview-card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.service-preview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.12);
}

.preview-chrome-bar {
  background: #f8fafc;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.preview-dots {
  display: flex;
  gap: 6px;
}

.preview-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.preview-dot.red { background: #ff5f56; }
.preview-dot.yellow { background: #ffbd2e; }
.preview-dot.green { background: #27c93f; }

.preview-url-pill {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 12px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #64748b;
  text-align: center;
}

.preview-image-wrap {
  width: 100%;
  height: 320px;
  overflow: hidden;
  position: relative;
  background: #f1f5f9;
}

.preview-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-floating-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(13, 14, 16, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.badge-beacon-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #24C875;
  box-shadow: 0 0 8px rgba(36, 200, 117, 0.9);
}

/* Service Introduction Section */
.service-intro-section {
  background: #ffffff;
  padding: 80px 24px;
}

.service-intro-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 56px;
  align-items: flex-start;
  margin-bottom: 56px;
}

.service-intro-left .section-heading {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--text-pure);
  margin-top: 12px;
}

.service-intro-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 1.05rem;
  color: var(--text-fog);
  line-height: 1.7;
}

.intro-pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.intro-pillar-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 28px;
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.intro-pillar-card:hover {
  transform: translateY(-4px);
  border-color: var(--brand-red-border);
  box-shadow: 0 12px 32px rgba(231, 25, 45, 0.08);
}

.pillar-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--brand-red-light);
  color: var(--brand-red);
  display: grid;
  place-items: center;
  margin-bottom: 16px;
}

.pillar-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-pure);
  margin-bottom: 8px;
}

.pillar-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin: 0;
}

/* Service Deliverables (What We Deliver - 6 Cards) */
.service-deliverables-section {
  background: var(--bg-surface);
  padding: 80px 24px;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.section-editorial-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 56px;
}

.section-editorial-header .section-heading {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.6vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-pure);
  margin: 12px 0 14px;
  line-height: 1.2;
}

.section-editorial-header .section-subtext {
  font-size: 1.05rem;
  color: var(--text-fog);
  line-height: 1.6;
  margin: 0;
}

.service-deliverables-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.deliverable-feature-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 36px 30px;
  position: relative;
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.deliverable-feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(231, 25, 45, 0.4);
  box-shadow: 0 16px 40px rgba(231, 25, 45, 0.08);
}

.deliverable-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--brand-red-light);
  color: var(--brand-red);
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.deliverable-feature-card:hover .deliverable-icon-wrap {
  transform: scale(1.08);
  background: rgba(231, 25, 45, 0.14);
}

.deliverable-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-pure);
  margin-bottom: 12px;
  line-height: 1.3;
}

.deliverable-card-desc {
  font-size: 0.94rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Why Choose Baadam Section */
.service-why-section {
  background: #ffffff;
  padding: 80px 24px;
}

.why-baadam-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.why-baadam-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all var(--transition-normal);
  position: relative;
}

.why-baadam-card:hover {
  transform: translateY(-5px);
  border-color: var(--brand-red);
  box-shadow: 0 12px 32px rgba(231, 25, 45, 0.08);
}

.why-card-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--brand-red);
  background: var(--brand-red-light);
  border: 1px solid var(--brand-red-border);
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  display: inline-block;
  align-self: flex-start;
}

.why-card-title {
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--text-pure);
  line-height: 1.3;
}

.why-card-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin: 0;
}

/* Service Process Section (6 Steps Timeline) */
.service-process-section {
  background: var(--bg-surface);
  padding: 80px 24px;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.process-timeline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.process-step-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  position: relative;
  transition: all var(--transition-normal);
}

.process-step-card:hover {
  transform: translateY(-5px);
  border-color: rgba(231, 25, 45, 0.35);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.05);
}

.process-step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.process-step-pill {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ffffff;
  background: var(--brand-red);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
}

.process-step-order {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
  color: #e2e8f0;
}

.process-step-title {
  font-family: var(--font-display);
  font-size: 1.18rem;
  font-weight: 700;
  color: var(--text-pure);
  margin-bottom: 10px;
}

.process-step-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Technologies Section */
.service-tech-section {
  background: #ffffff;
  padding: 80px 24px;
}

.tech-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 20px;
}

.tech-badge-item {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all var(--transition-fast);
}

.tech-badge-item:hover {
  border-color: var(--brand-red);
  box-shadow: 0 8px 24px rgba(231, 25, 45, 0.08);
  transform: translateY(-2px);
}

.tech-badge-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--brand-red-light);
  color: var(--brand-red);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.tech-badge-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-pure);
  line-height: 1.2;
}

.tech-badge-role {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 3px;
}

/* Related Projects Section on Service Pages */
.service-projects-section {
  background: var(--bg-surface);
  padding: 80px 24px;
  border-top: 1px solid var(--border-subtle);
}

.service-projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.service-project-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.service-project-card:hover {
  transform: translateY(-6px);
  border-color: rgba(231, 25, 45, 0.35);
  box-shadow: 0 12px 32px rgba(231, 25, 45, 0.1);
}

.service-project-media {
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
}

.service-project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-smooth);
}

.service-project-card:hover .service-project-img {
  transform: scale(1.05);
}

.service-project-body {
  padding: 26px 24px 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.service-project-kicker {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--brand-red);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.service-project-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-pure);
  margin-bottom: 10px;
}

.service-project-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin-bottom: 16px;
  flex: 1;
}

.service-project-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.service-project-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-chalk);
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
}

.service-project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--brand-red);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: gap var(--transition-fast);
}

.service-project-card:hover .service-project-link {
  gap: 10px;
}

/* Responsive Overrides */
@media (max-width: 1024px) {
  .service-hero-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .service-intro-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .intro-pillars-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .service-deliverables-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .why-baadam-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .process-timeline-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .service-projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .service-deliverables-grid,
  .why-baadam-grid,
  .process-timeline-grid {
    grid-template-columns: 1fr;
  }
  .breadcrumb-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .service-hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .service-hero-actions .btn-pill {
    width: 100%;
    justify-content: center;
  }
}
"""

with open('style.css', 'r', encoding='utf-8') as f:
    orig_css = f.read()

# Append cleanly to style.css
new_css = orig_css.rstrip() + "\n\n" + service_detail_css.strip() + "\n"

with open('style.css', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_css)

print("Successfully added service detail styles to style.css!")

