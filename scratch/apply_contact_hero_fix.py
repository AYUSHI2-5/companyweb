# 1. Update contact.html headline spans
with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_h1 = '''            <!-- Main Heading with Red Accent Line -->
            <h1 class="contact-hero-heading">
              Let's Build Something<br>
              <span class="text-brand-red">Scalable &amp; Transformative.</span>
            </h1>'''

new_h1 = '''            <!-- Main Heading with Red Accent Line -->
            <h1 class="contact-hero-heading">
              <span class="heading-line-1">Let's Build Something</span><br>
              <span class="heading-line-2 text-brand-red">Scalable &amp; Transformative.</span>
            </h1>'''

if old_h1 in html:
    html = html.replace(old_h1, new_h1)
    print('contact.html h1 updated with line spans')

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update style.css for contact-page-hero
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target_start = '/* ===============================================================\n   Contact Hero Section'
target_end = '/* ===============================================================\n   About Us Hero Section'

idx1 = css.find(target_start)
idx2 = css.find(target_end)

new_contact_css = '''/* ===============================================================
   Contact Hero Section (Exact Match to User Reference Mockup)
   =============================================================== */
.contact-page-hero {
  position: relative;
  background: #ffffff;
  padding-top: 175px;
  padding-top: clamp(155px, 17vh, 195px);
  padding-bottom: clamp(60px, 8vh, 90px);
  overflow: hidden;
}

.contact-page-hero .section-container {
  padding: 0 clamp(24px, 4vw, 48px);
  max-width: var(--container-max-width, 1280px);
  margin: 0 auto;
}

.contact-hero-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.95fr;
  gap: clamp(28px, 4.5vw, 56px);
  align-items: center;
}

.contact-hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
}

.contact-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
  background: rgba(235, 22, 60, 0.04);
  border: 1px solid rgba(235, 22, 60, 0.18);
  padding: 6px 16px;
  border-radius: 999px;
  font-family: var(--font-mono, monospace);
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #374151;
}

.contact-hero-heading {
  font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
  font-size: clamp(2.1rem, 3.4vw, 3.4rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #0a1128;
  margin: 0;
}

.contact-hero-heading .heading-line-1,
.contact-hero-heading .heading-line-2 {
  white-space: nowrap;
  display: inline-block;
}

.contact-title-accent {
  width: 48px;
  height: 3.5px;
  background: #EB163C;
  border-radius: 999px;
  margin: 16px 0 22px 0;
}

.contact-hero-desc {
  font-size: clamp(1rem, 1.15vw, 1.1rem);
  line-height: 1.68;
  color: #4b5563;
  max-width: 560px;
  margin-bottom: 28px;
}

.contact-hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: clamp(36px, 5vh, 48px);
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #C81E2E;
  color: #ffffff !important;
  font-family: var(--font-display, inherit);
  font-size: 0.96rem;
  font-weight: 700;
  padding: 13px 28px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(200, 30, 46, 0.28);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-hero-primary:hover {
  background: #EB163C;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(235, 22, 60, 0.35);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  color: #111827 !important;
  font-family: var(--font-display, inherit);
  font-size: 0.96rem;
  font-weight: 700;
  padding: 12px 26px;
  border-radius: 999px;
  border: 1.5px solid #d1d5db;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-hero-secondary:hover {
  border-color: #EB163C;
  color: #EB163C !important;
  background: rgba(235, 22, 60, 0.03);
  transform: translateY(-2px);
}

/* Trust Bar with Vertical Dividers matching mockup */
.contact-hero-trust-bar {
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.8vw, 22px);
  padding-top: 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.85);
  width: 100%;
}

.hero-trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.hero-trust-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(235, 22, 60, 0.08);
  border: 1px solid rgba(235, 22, 60, 0.16);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.hero-trust-text {
  display: flex;
  flex-direction: column;
}

.hero-trust-text strong {
  font-family: var(--font-display, inherit);
  font-size: 0.88rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

.hero-trust-text span {
  font-size: 0.76rem;
  color: #64748b;
  margin-top: 2px;
  line-height: 1.35;
}

.hero-trust-divider {
  width: 1px;
  height: 28px;
  background: #e2e8f0;
  flex-shrink: 0;
}

/* Right Visual Stage */
.contact-hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-visual-stage {
  position: relative;
  width: 100%;
  max-width: 540px;
  border-radius: 20px;
  overflow: visible;
}

.contact-workspace-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 18px 36px rgba(15, 23, 42, 0.06));
}

@media (max-width: 1024px) {
  .contact-hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .contact-hero-heading .heading-line-1,
  .contact-hero-heading .heading-line-2 {
    white-space: normal;
  }
  .contact-hero-trust-bar {
    flex-wrap: wrap;
    gap: 16px;
  }
  .hero-trust-divider {
    display: none;
  }
  .hero-trust-item {
    flex: 1 1 200px;
  }
}

@media (max-width: 640px) {
  .contact-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-hero-primary,
  .btn-hero-secondary {
    justify-content: center;
  }
  .contact-hero-trust-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

'''

if idx1 != -1 and idx2 != -1:
    css = css[:idx1] + new_contact_css + css[idx2:]
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('style.css contact section updated successfully')
else:
    print('Could not find markers in style.css')

