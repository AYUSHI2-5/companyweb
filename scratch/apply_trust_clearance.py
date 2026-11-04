with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = '''.contact-page-hero {
  position: relative;
  background: #fbfbfe;
  padding-top: 160px;
  padding-top: clamp(140px, 16vh, 180px);
  padding-bottom: 48px;
  overflow: hidden;
}

.contact-showcase-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto clamp(24px, 4vw, 36px);
  padding: 0 16px;
}

.contact-trust-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1040px;
  margin: 36px auto 0;
  padding-top: 28px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}'''

replacement = '''.contact-page-hero {
  position: relative;
  background: var(--bg-body, #ffffff);
  padding-top: 150px;
  padding-top: clamp(135px, 15vh, 175px);
  padding-bottom: clamp(60px, 8vh, 90px);
}

.contact-trust-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2.5vw, 32px);
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  /* Clear the fixed teacher avatar standing at bottom-left (width 150px) */
  padding-left: clamp(165px, 14vw, 205px);
}

@media (max-width: 1024px) {
  .contact-trust-bar {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-left: clamp(150px, 18vw, 190px);
  }
}

@media (max-width: 640px) {
  .contact-trust-bar {
    grid-template-columns: 1fr;
    gap: 14px;
    padding-left: 0;
    margin-bottom: 80px;
  }
}'''

if target in css:
    css = css.replace(target, replacement)
    # Also ensure strong in trust badge has white-space: nowrap
    css = css.replace('.trust-badge-text strong {', '.trust-badge-text strong {\n  white-space: nowrap;')
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('style.css updated successfully with teacher avatar clearance')
else:
    print('Could not find target in style.css')

