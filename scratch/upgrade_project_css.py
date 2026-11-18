import re

new_css = """/* --------------------------------------------------------------------------
   Dedicated Project Detail Page Layout (.project-detail-page)
   -------------------------------------------------------------------------- */
.project-detail-page {
  background-color: #FAFAFA;
  color: var(--text-pure);
  min-height: 100vh;
}

/* Hide teacher avatar on project detail pages so it does not block reading */
.project-detail-page .teacher-guide-widget {
  display: none !important;
}

/* Project Hero Header */
.project-page-hero {
  padding-top: 40px;
  padding-bottom: 56px;
  background: radial-gradient(100% 120% at 50% 0%, rgba(231, 25, 45, 0.035) 0%, #FFFFFF 100%);
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
}

.project-hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.project-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.project-case-badge {
  background: var(--brand-red);
  color: #FFFFFF;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 12px rgba(231, 25, 45, 0.25);
}

.project-industry-badge {
  background: #FFFFFF;
  color: #374151;
  border: 1px solid #E2E8F0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.project-hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 4.4vw, 3.8rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: #0F172A;
  margin-bottom: 14px;
}

.project-hero-kicker {
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  font-weight: 500;
  line-height: 1.55;
  color: #475569;
  max-width: 860px;
  margin-bottom: 24px;
}

/* Hashtags Cloud */
.project-hashtags-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.project-hashtag-pill {
  display: inline-block;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #475569;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all var(--transition-fast);
}

.project-hashtag-pill:hover {
  background: rgba(231, 25, 45, 0.06);
  border-color: rgba(231, 25, 45, 0.35);
  color: var(--brand-red);
  transform: translateY(-1px);
}

/* Action Header Row with Visit Project Button */
.project-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.btn-visit-project {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #E7192D 0%, #C91425 100%);
  color: #FFFFFF !important;
  padding: 13px 28px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(231, 25, 45, 0.32);
  transition: all var(--transition-fast);
}

.btn-visit-project:hover {
  background: linear-gradient(135deg, #F0283D 0%, #D41729 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(231, 25, 45, 0.45);
}

.btn-discuss-project {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  color: #1E293B !important;
  border: 1px solid #CBD5E1;
  padding: 13px 26px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.84rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-discuss-project:hover {
  background: #FFF5F5;
  border-color: var(--brand-red);
  color: var(--brand-red) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(231, 25, 45, 0.12);
}

/* --------------------------------------------------------------------------
   CMS Portfolio Field Layout Extensions (Matching CMS Schema)
   -------------------------------------------------------------------------- */
.project-cms-spec-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.035);
}

.cms-spec-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #F8FAFC;
  border: 1px solid #EDF2F7;
  border-radius: 12px;
  padding: 14px 16px;
  transition: all 0.2s ease;
}

.cms-spec-item:hover {
  background: #FFFFFF;
  border-color: rgba(231, 25, 45, 0.3);
  box-shadow: 0 4px 16px rgba(231, 25, 45, 0.06);
  transform: translateY(-2px);
}

.cms-spec-label {
  font-family: var(--font-mono);
  font-size: 0.70rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-red);
}

.cms-spec-val {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.35;
  display: flex;
  align-items: center;
  gap: 6px;
  word-break: break-word;
}

.cms-spec-link {
  color: var(--brand-red);
  text-decoration: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--transition-fast);
}

.cms-spec-link:hover {
  color: var(--brand-red-hover);
  text-decoration: underline;
}

/* Multi-Image Visual Stage Section */
.project-stage-section {
  padding: 40px 0 60px;
  background: #FAFAFA;
}

.project-stage-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.project-stage-frame {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12), 0 4px 16px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #FFFFFF;
}

.project-stage-img {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: cover;
  display: block;
}

.project-status-pill {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-pill);
  padding: 7px 18px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: #0F172A;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.project-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

/* Secondary Multi-Image Gallery */
.project-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.project-gallery-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: #0F172A;
  height: 320px;
}

.project-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
  opacity: 0.96;
}

.project-gallery-card:hover .project-gallery-img {
  transform: scale(1.04);
  opacity: 1;
}

.gallery-caption-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #FFFFFF;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Project Story Section (Challenge vs Solution) */
.project-story-section {
  padding: 70px 0 80px;
  background: #FFFFFF;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.project-story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 36px;
}

.project-story-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 36px 32px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.03);
  position: relative;
  transition: all 0.25s ease;
}

.project-story-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.challenge-card {
  border-left: 4px solid var(--brand-red);
  background: linear-gradient(145deg, rgba(231, 25, 45, 0.015) 0%, #FFFFFF 100%);
}

.solution-card {
  border-left: 4px solid #10B981;
  background: linear-gradient(145deg, rgba(16, 185, 129, 0.015) 0%, #FFFFFF 100%);
}

.story-card-kicker {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
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
  color: #0F172A;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.story-card-body {
  font-size: 0.96rem;
  color: #475569;
  line-height: 1.7;
}

/* Key Capabilities & Architecture Modules */
.project-features-section {
  padding: 80px 0;
  background: #FAFAFA;
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
  color: #0F172A;
  margin-bottom: 12px;
}

.section-head-sub {
  font-size: 0.96rem;
  color: #64748B;
  line-height: 1.65;
}

.project-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.project-feature-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 18px;
  padding: 32px 28px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
}

.project-feature-card:hover {
  border-color: var(--brand-red);
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(231, 25, 45, 0.09);
}

.feature-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: rgba(231, 25, 45, 0.08);
  color: var(--brand-red);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  margin-bottom: 18px;
}

.feature-card-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 8px;
}

.feature-card-text {
  font-size: 0.94rem;
  color: #64748B;
  line-height: 1.65;
}

/* Impact & Technology Stack Section */
.project-impact-section {
  padding: 70px 0 80px;
  background: #FFFFFF;
  border-top: 1px solid var(--border-subtle);
}

.project-impact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: stretch;
}

.impact-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 36px 32px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
}

.impact-card-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.impact-card-text {
  font-size: 0.95rem;
  color: #64748B;
  line-height: 1.65;
  margin-bottom: 24px;
}

.portfolio-outcome-banner {
  margin-top: auto;
  padding: 18px 22px;
  background: rgba(16, 185, 129, 0.07);
  border: 1px solid rgba(16, 185, 129, 0.22);
  border-radius: 14px;
}

.project-tech-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}

.project-tech-badge {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #1E293B;
  padding: 7px 16px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  transition: all var(--transition-fast);
}

.project-tech-badge:hover {
  background: #FFFFFF;
  border-color: var(--brand-red);
  color: var(--brand-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 25, 45, 0.15);
}

/* Project Prev / Next Pagination Bar */
.project-navigation-bar {
  padding: 28px 0;
  background: #FAFAFA;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.project-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-project-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  color: #1E293B;
  text-decoration: none;
  padding: 10px 22px;
  border-radius: var(--radius-pill);
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  transition: all var(--transition-fast);
}

.nav-project-btn:hover {
  background: var(--brand-red);
  color: #FFFFFF !important;
  border-color: var(--brand-red);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(231, 25, 45, 0.25);
}

.nav-project-btn.nav-all-btn {
  background: #FFFFFF;
  border-color: #CBD5E1;
  color: #475569;
}

.nav-project-btn.nav-all-btn:hover {
  background: #0F172A;
  color: #FFFFFF !important;
  border-color: #0F172A;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.2);
}

/* Responsive Styles for Project Detail Page */
@media (max-width: 992px) {
  .project-cms-spec-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
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
  .project-gallery-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .project-cms-spec-grid {
    grid-template-columns: 1fr;
    padding: 18px;
  }
  .project-nav-inner {
    flex-direction: column;
    gap: 12px;
  }
  .nav-project-btn {
    width: 100%;
    justify-content: center;
  }
  .project-header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-visit-project,
  .btn-discuss-project {
    justify-content: center;
    width: 100%;
  }
}
"""

with open('style.css', 'r', encoding='utf-8') as f:
    orig = f.read()

start_marker = '/* --------------------------------------------------------------------------\n   Dedicated Project Detail Page Layout (.project-detail-page)'
pos = orig.find(start_marker)
if pos == -1:
    print('Marker not found!')
else:
    updated = orig[:pos] + new_css
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(updated)
    print('style.css updated cleanly from marker!')

# Verify braces
with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

opens = text.count('{')
closes = text.count('}')
print(f'Braces check: {opens} open, {closes} close, delta: {opens - closes}')

