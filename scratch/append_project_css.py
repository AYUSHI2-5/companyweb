with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

section_23 = """
/* ==========================================================================
   23. Dedicated Project Detail Pages & Portfolio Card Action Row
   ========================================================================== */

/* Portfolio Grid Card Action Button */
.portfolio-card-actions {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.btn-portfolio-view {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  background: #FFFFFF;
  color: #111827;
  border: 1.5px solid #E5E7EB;
  border-radius: var(--radius-pill);
  padding: 10px 20px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn-portfolio-view:hover {
  background: var(--brand-red);
  color: #FFFFFF;
  border-color: var(--brand-red);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 25, 45, 0.28);
}

.btn-portfolio-view .btn-arrow-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F3F4F6;
  color: #111827;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  font-weight: 800;
  transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
}

.btn-portfolio-view:hover .btn-arrow-circle {
  background: #FFFFFF;
  color: var(--brand-red);
  transform: translateX(3px);
}

/* --------------------------------------------------------------------------
   Dedicated Project Detail Page Layout (.project-detail-page)
   -------------------------------------------------------------------------- */
.project-detail-page {
  background-color: #FFFFFF;
  color: var(--text-pure);
  min-height: 100vh;
}

.project-page-hero {
  padding-top: calc(var(--header-height) + 36px);
  padding-bottom: 50px;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%);
  border-bottom: 1px solid var(--border-subtle);
}

.project-hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.project-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
  transition: color var(--transition-fast), transform var(--transition-fast);
  text-decoration: none;
}

.project-back-link:hover {
  color: var(--brand-red);
  transform: translateX(-4px);
}

.project-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.project-case-badge {
  background: var(--brand-red);
  color: #FFFFFF;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
}

.project-industry-badge {
  background: #F3F4F6;
  color: #374151;
  border: 1px solid #E5E7EB;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
}

.project-hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: var(--text-pure);
  margin-bottom: 14px;
}

.project-hero-kicker {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  font-weight: 500;
  line-height: 1.5;
  color: #4B5563;
  max-width: 820px;
  margin-bottom: 32px;
}

/* Metadata Strip Grid */
.project-meta-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.04);
}

.project-meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-meta-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--brand-red);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.project-meta-val {
  font-family: var(--font-display);
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--text-pure);
  line-height: 1.35;
}

/* Hero Visual Stage */
.project-stage-section {
  padding: 40px 0 60px;
  background: #FFFFFF;
}

.project-stage-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.project-stage-frame {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #F8FAFC;
  max-height: 580px;
}

.project-stage-img {
  width: 100%;
  height: 100%;
  max-height: 580px;
  object-fit: cover;
  display: block;
}

.project-status-pill {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-pill);
  padding: 6px 16px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.project-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 6px #10B981;
}

/* Project Story Grid (Challenge vs Solution) */
.project-story-section {
  padding: 60px 0 70px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.project-story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
}

.project-story-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.story-card-kicker {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.challenge-card .story-card-kicker {
  color: var(--brand-red);
}

.solution-card .story-card-kicker {
  color: #059669;
}

.story-card-title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-pure);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.story-card-body {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.68;
}

/* Key Features & Architecture */
.project-features-section {
  padding: 70px 0 80px;
  background: #FFFFFF;
}

.section-head-center {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 48px;
}

.section-head-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-red);
  margin-bottom: 8px;
}

.section-head-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.6vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-pure);
  margin-bottom: 12px;
}

.section-head-sub {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.project-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.project-feature-card {
  background: #FAFAFA;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 30px 28px;
  transition: all var(--transition-fast);
}

.project-feature-card:hover {
  background: #FFFFFF;
  border-color: var(--brand-red);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(231, 25, 45, 0.08);
}

.feature-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(231, 25, 45, 0.1);
  color: var(--brand-red);
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.feature-card-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-pure);
  margin-bottom: 8px;
}

.feature-card-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Technology Stack & Outcome Row */
.project-impact-section {
  padding: 60px 0 70px;
  background: #FAFAFA;
  border-top: 1px solid var(--border-subtle);
}

.project-impact-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 36px;
  align-items: stretch;
}

.impact-card {
  background: #FFFFFF;
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.impact-card-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-pure);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.impact-card-text {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 24px;
}

.project-tech-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}

.project-tech-badge {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #111827;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
}

/* Project Navigation Prev/Next Bar */
.project-navigation-bar {
  padding: 32px 0;
  background: #FFFFFF;
  border-top: 1px solid var(--border-subtle);
}

.project-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-project-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-pure);
  text-decoration: none;
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.nav-project-btn:hover {
  background: var(--brand-red);
  color: #FFFFFF;
  border-color: var(--brand-red);
  transform: translateY(-2px);
}

/* Responsive Styles for Project Detail Page */
@media (max-width: 992px) {
  .project-meta-strip {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
  .project-story-grid {
    grid-template-columns: 1fr;
  }
  .project-features-grid {
    grid-template-columns: 1fr;
  }
  .project-impact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .project-meta-strip {
    grid-template-columns: 1fr;
  }
  .project-nav-inner {
    flex-direction: column;
    gap: 12px;
  }
  .nav-project-btn {
    width: 100%;
    justify-content: center;
  }
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(section_23)

print("Appended Section 23 to style.css successfully!")

