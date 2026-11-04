with open('style.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re
old_headline_css = '''/* Central Headline Sized to Fit Generously Inside the Circle */
.hero-lens-headline {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.1vw, 2.1rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: #111827;
  margin-bottom: 8px;
  max-width: 440px;
  text-align: center;
}

/* The Single-Line Highlight Pill */
.hero-lime-tag {
  display: inline-block;
  background-color: #E7192D;
  color: #FFFFFF;
  padding: 1px 14px 3px;
  border-radius: 9999px;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: 0 3px 12px rgba(231, 25, 45, 0.35);
  transform: translateY(-2px);
  text-shadow: none;
}

/* Subtitle description */
.hero-lens-desc {
  font-size: clamp(0.76rem, 0.9vw, 0.86rem);
  line-height: 1.38;
  color: #4b5563;
  max-width: 350px;
  margin: 0 auto 12px;
  font-weight: 500;
  text-align: center;
}'''

new_headline_css = '''/* Central Headline Sized to Fit Generously Inside the Circle */
.hero-lens-headline {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.75vw, 1.75rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #111827;
  margin-bottom: 8px;
  max-width: 460px;
  text-align: center;
}

/* The Single-Line Highlight Pill */
.hero-lime-tag {
  display: inline-block;
  background-color: #E7192D;
  color: #FFFFFF;
  padding: 2px 14px 3px;
  border-radius: 9999px;
  font-size: 0.9em;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: 0 3px 12px rgba(231, 25, 45, 0.32);
  transform: translateY(-2px);
  text-shadow: none;
  white-space: nowrap;
}

/* Subtitle description */
.hero-lens-desc {
  font-size: clamp(0.74rem, 0.82vw, 0.82rem);
  line-height: 1.36;
  color: #4b5563;
  max-width: 380px;
  margin: 0 auto 12px;
  font-weight: 500;
  text-align: center;
}'''

if old_headline_css in c:
    c = c.replace(old_headline_css, new_headline_css, 1)
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated style.css for single-line sleek red pill')
else:
    print('Target not found in style.css')

