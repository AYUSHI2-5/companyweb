about_css = '''
/* ===============================================================
   About Us Hero Section (Exact Match to User Reference Mockup)
   =============================================================== */
.about-page-hero {
  position: relative;
  background: #ffffff;
  padding-top: 150px;
  padding-top: clamp(135px, 15vh, 175px);
  padding-bottom: clamp(60px, 8vh, 90px);
  overflow: hidden;
}

.about-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(28px, 4.5vw, 56px);
  align-items: center;
}

.about-hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
}

.about-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
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

.about-hero-heading {
  font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
  font-size: clamp(2.5rem, 4.2vw, 4.1rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.025em;
  color: #0a1128;
  margin: 0;
}

.about-title-accent {
  width: 48px;
  height: 3.5px;
  background: #EB163C;
  border-radius: 999px;
  margin: 16px 0 20px 0;
}

.about-hero-subhead {
  font-family: var(--font-display, inherit);
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.015em;
  line-height: 1.4;
  margin-bottom: 14px;
}

.about-hero-lead {
  font-size: clamp(0.92rem, 1.05vw, 0.98rem);
  line-height: 1.68;
  color: #4b5563;
  max-width: 600px;
  margin-bottom: clamp(28px, 4vh, 36px);
}

/* Trust / Stats Bar with Dividers matching mockup */
.about-hero-trust-bar {
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.8vw, 22px);
  padding-top: 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.85);
  width: 100%;
}

.about-trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.about-trust-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(235, 22, 60, 0.08);
  border: 1px solid rgba(235, 22, 60, 0.16);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.about-trust-text {
  display: flex;
  flex-direction: column;
}

.about-trust-text strong {
  font-family: var(--font-display, inherit);
  font-size: 0.88rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

.about-trust-text span {
  font-size: 0.76rem;
  color: #64748b;
  margin-top: 2px;
  line-height: 1.35;
}

.about-trust-divider {
  width: 1px;
  height: 28px;
  background: #e2e8f0;
  flex-shrink: 0;
}

/* Right Visual Stage */
.about-hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-visual-stage {
  position: relative;
  width: 100%;
  max-width: 500px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04);
}

.about-office-showcase-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 28px;
}

@media (max-width: 1024px) {
  .about-hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .about-hero-trust-bar {
    flex-wrap: wrap;
    gap: 16px;
  }
  .about-trust-divider {
    display: none;
  }
  .about-trust-item {
    flex: 1 1 200px;
  }
}

@media (max-width: 640px) {
  .about-hero-trust-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
'''

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '.about-page-hero' not in css:
    css += about_css
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('style.css updated with about-page-hero')
else:
    print('about-page-hero already in style.css')

