portfolio_css = '''
/* ===============================================================
   Portfolio Hero Section (Exact Match to User Reference Mockup)
   =============================================================== */
.portfolio-page-hero {
  position: relative;
  background: #ffffff;
  padding-top: 150px;
  padding-top: clamp(135px, 15vh, 175px);
  padding-bottom: clamp(60px, 8vh, 90px);
  overflow: hidden;
}

.portfolio-hero-grid {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: clamp(28px, 4.5vw, 56px);
  align-items: center;
}

.portfolio-hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
}

.portfolio-kicker {
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

.portfolio-hero-heading {
  font-family: var(--font-display, 'Cabinet Grotesk', sans-serif);
  font-size: clamp(2.5rem, 4.2vw, 4.1rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.025em;
  color: #0a1128;
  margin: 0 0 20px 0;
}

.portfolio-hero-desc {
  font-size: clamp(1rem, 1.2vw, 1.12rem);
  line-height: 1.68;
  color: #4b5563;
  max-width: 540px;
  margin-bottom: 32px;
}

.portfolio-hero-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: clamp(40px, 6vh, 56px);
}

.btn-underline-link {
  font-family: var(--font-display, inherit);
  font-size: 0.98rem;
  font-weight: 700;
  color: #0a1128;
  text-decoration: none;
  position: relative;
  padding-bottom: 4px;
  display: inline-block;
  transition: color 0.2s ease;
}

.btn-underline-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #EB163C;
  border-radius: 999px;
  transition: transform 0.25s ease;
}

.btn-underline-link:hover {
  color: #EB163C;
}

.btn-underline-link:hover::after {
  transform: scaleX(1.08);
}

/* Capabilities Bar with Dividers matching mockup */
.portfolio-hero-trust-bar {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  padding-top: 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.85);
  width: 100%;
}

.portfolio-trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.portfolio-trust-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.portfolio-trust-text strong {
  font-family: var(--font-display, inherit);
  font-size: 0.92rem;
  font-weight: 700;
  color: #0a1128;
  white-space: nowrap;
}

.portfolio-trust-divider {
  width: 1px;
  height: 28px;
  background: #e2e8f0;
  flex-shrink: 0;
}

/* Right Visual Stage */
.portfolio-hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.portfolio-visual-stage {
  position: relative;
  width: 100%;
  max-width: 520px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04);
}

.portfolio-showcase-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 24px;
}

@media (max-width: 1024px) {
  .portfolio-hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .portfolio-hero-trust-bar {
    flex-wrap: wrap;
    gap: 16px;
  }
  .portfolio-trust-divider {
    display: none;
  }
  .portfolio-trust-item {
    flex: 1 1 200px;
  }
}

@media (max-width: 640px) {
  .portfolio-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .portfolio-hero-trust-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
'''

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '.portfolio-page-hero' not in css:
    css += portfolio_css
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('style.css updated with portfolio-page-hero')
else:
    print('portfolio-page-hero already in style.css')

