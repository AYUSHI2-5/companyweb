# 1. Update portfolio.html headline with line spans
with open('portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_h1 = '''            <!-- Main Heading -->
            <h1 class="portfolio-hero-heading">
              Technology That Delivers.<br>
              <span class="text-brand-red">Results That Matter.</span>
            </h1>'''

new_h1 = '''            <!-- Main Heading -->
            <h1 class="portfolio-hero-heading">
              <span class="heading-line-1">Technology That Delivers.</span><br>
              <span class="heading-line-2 text-brand-red">Results That Matter.</span>
            </h1>'''

if old_h1 in html:
    html = html.replace(old_h1, new_h1)
    print('portfolio.html h1 updated with line spans')

# Update image dimensions in portfolio.html to 447 x 405 (the exact clean crop)
html = html.replace('width="513" \n                   height="424"', 'width="447" \n                   height="405"')
html = html.replace('width="513" height="424"', 'width="447" height="405"')

with open('portfolio.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update style.css for portfolio-page-hero
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

port_start = '/* ===============================================================\n   Portfolio Hero Section'
idx = css.find(port_start)
if idx != -1:
    css_before = css[:idx]
else:
    css_before = css

new_portfolio_css = '''/* ===============================================================
   Portfolio Hero Section (Exact Match to User Reference Mockup)
   =============================================================== */
.portfolio-page-hero {
  position: relative;
  background: #ffffff;
  padding-top: 175px;
  padding-top: clamp(155px, 17vh, 195px);
  padding-bottom: clamp(70px, 9vh, 110px);
  overflow: hidden;
}

@media (min-width: 992px) {
  .portfolio-page-hero .section-container {
    padding-left: clamp(165px, 14vw, 210px);
    padding-right: clamp(24px, 3vw, 40px);
  }
}

.portfolio-hero-grid {
  display: grid !important;
  grid-template-columns: 1.25fr 0.95fr !important;
  gap: clamp(28px, 4vw, 52px) !important;
  align-items: center !important;
}

.portfolio-hero-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  z-index: 2 !important;
}

.portfolio-kicker {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin-bottom: 22px !important;
  background: rgba(235, 22, 60, 0.04) !important;
  border: 1px solid rgba(235, 22, 60, 0.18) !important;
  padding: 6px 16px !important;
  border-radius: 999px !important;
  font-family: var(--font-mono, monospace) !important;
  font-size: 0.74rem !important;
  letter-spacing: 0.06em !important;
  font-weight: 700 !important;
  color: #374151 !important;
}

.portfolio-hero-heading {
  font-family: var(--font-display, 'Cabinet Grotesk', sans-serif) !important;
  font-size: clamp(2.1rem, 3.4vw, 3.4rem) !important;
  font-weight: 800 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.025em !important;
  color: #0a1128 !important;
  margin: 0 0 20px 0 !important;
}

.portfolio-hero-heading .heading-line-1,
.portfolio-hero-heading .heading-line-2 {
  white-space: nowrap !important;
  display: inline-block !important;
}

.portfolio-hero-desc {
  font-size: clamp(0.96rem, 1.1vw, 1.08rem) !important;
  line-height: 1.68 !important;
  color: #4b5563 !important;
  max-width: 550px !important;
  margin-bottom: 28px !important;
}

.portfolio-hero-actions {
  display: flex !important;
  align-items: center !important;
  gap: 24px !important;
  flex-wrap: wrap !important;
  margin-bottom: clamp(36px, 5vh, 48px) !important;
}

.btn-underline-link {
  font-family: var(--font-display, inherit) !important;
  font-size: 0.98rem !important;
  font-weight: 700 !important;
  color: #0a1128 !important;
  text-decoration: none !important;
  position: relative !important;
  padding-bottom: 4px !important;
  display: inline-block !important;
  transition: color 0.2s ease !important;
}

.btn-underline-link::after {
  content: '' !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 2px !important;
  background: #EB163C !important;
  border-radius: 999px !important;
  transition: transform 0.25s ease !important;
}

.btn-underline-link:hover {
  color: #EB163C !important;
}

.btn-underline-link:hover::after {
  transform: scaleX(1.08) !important;
}

/* Capabilities Bar with Dividers matching mockup */
.portfolio-hero-trust-bar {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: clamp(16px, 2.4vw, 32px) !important;
  padding-top: 24px !important;
  border-top: 1px solid rgba(226, 232, 240, 0.85) !important;
  width: 100% !important;
}

.portfolio-trust-item {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 12px !important;
  flex: 0 0 auto !important;
}

.portfolio-trust-icon {
  display: grid !important;
  place-items: center !important;
  flex-shrink: 0 !important;
}

.portfolio-trust-text strong {
  font-family: var(--font-display, inherit) !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  color: #0a1128 !important;
  white-space: nowrap !important;
}

.portfolio-trust-divider {
  width: 1px !important;
  height: 24px !important;
  background: #d1d5db !important;
  flex: 0 0 1px !important;
  margin: 0 4px !important;
}

/* Right Visual Stage */
.portfolio-hero-visual {
  position: relative !important;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
}

.portfolio-visual-stage {
  position: relative !important;
  width: 100% !important;
  max-width: 500px !important;
  border-radius: 24px !important;
  overflow: hidden !important;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04) !important;
}

.portfolio-showcase-img {
  width: 100% !important;
  height: auto !important;
  display: block !important;
  object-fit: cover !important;
  border-radius: 24px !important;
}

@media (max-width: 1024px) {
  .portfolio-hero-grid {
    grid-template-columns: 1fr !important;
    gap: 36px !important;
  }
  .portfolio-hero-heading .heading-line-1,
  .portfolio-hero-heading .heading-line-2 {
    white-space: normal !important;
  }
  .portfolio-hero-trust-bar {
    flex-wrap: wrap !important;
    gap: 16px !important;
  }
  .portfolio-trust-divider {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .portfolio-hero-actions {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .portfolio-hero-trust-bar {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
}
'''

css = css_before + new_portfolio_css

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('style.css updated with perfect portfolio section')

