# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update navbar CTA button on index.html to match other pages
old_nav_cta = '''<div class="nav-cta-wrapper">
          <a href="contact.html" class="btn-talk" aria-label="Book a call">
            <span>Book a call</span>
            <span class="nav-arrow-circle" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
          </a>
        </div>'''

new_nav_cta = '''<div class="nav-cta-wrapper">
          <a href="contact.html" class="btn-talk" aria-label="Start a conversation">
            <span>Let's Talk</span>
            <span class="nav-arrow-circle" aria-hidden="true">&rarr;</span>
          </a>
        </div>'''

if old_nav_cta in html:
    html = html.replace(old_nav_cta, new_nav_cta)
    print('Updated navbar CTA in index.html')
else:
    print('old_nav_cta not matched, searching with normalization')
    import re
    html = re.sub(r'<div class="nav-cta-wrapper">\s*<a href="contact\.html" class="btn-talk" aria-label="Book a call">[\s\S]*?</div>', new_nav_cta, html)
    print('Updated navbar CTA via regex')

# Update circle text in index.html
old_headline = '''<h1 class="hero-lens-headline">
              Get Your Business On Height,<br>
              <span class="hero-lime-tag">With Our Product And Services</span>
            </h1>'''

new_headline = '''<h1 class="hero-lens-headline">
              Take Your Business To New Heights,<br>
              <span class="hero-lime-tag">With Our Products &amp; Services.</span>
            </h1>'''

old_desc = '''<p class="hero-lens-desc">
              We, Baadam Info And Trade Link Services Pvt. Ltd., a young yet experienced, dynamic, and technology-based company, are here to reduce your financial issues and increase your business\'s growth. Having an experience of five years, with more than thirty workers, we ensure an increase in traffic, high-quality software, offer e-commerce, and an increase in product awareness.
            </p>'''

new_desc = '''<p class="hero-lens-desc">
              We help businesses grow with cutting-edge software, custom web development, mobile apps, e-commerce, and high-impact digital marketing.
            </p>'''

if old_headline in html:
    html = html.replace(old_headline, new_headline)
    print('Updated circle headline')
else:
    import re
    html = re.sub(r'<h1 class="hero-lens-headline">[\s\S]*?</h1>', new_headline, html, count=1)
    print('Updated circle headline via regex')

if old_desc in html:
    html = html.replace(old_desc, new_desc)
    print('Updated circle description')
else:
    import re
    html = re.sub(r'<p class="hero-lens-desc">[\s\S]*?</p>', new_desc, html, count=1)
    print('Updated circle description via regex')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Saved index.html')

# 2. Update style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update hero-section padding and hero-top-badge position
css = css.replace('padding: calc(var(--header-height) + 12px) 24px 16px;', 'padding: calc(var(--header-height) + 24px) 24px 16px;')

# Update hero-top-badge
old_badge = '''.hero-top-badge {
  position: absolute;
  top: -20px;'''

new_badge = '''.hero-top-badge {
  position: absolute;
  top: -14px;'''

css = css.replace(old_badge, new_badge)

# Update hero-lens-circle size to ensure no crowding
old_circle = 'width: min(clamp(480px, 64vw, 715px), 67.5vh);'
new_circle = 'width: min(clamp(460px, 62vw, 680px), 63vh);'
css = css.replace(old_circle, new_circle)

# Update hero-lens-desc font-size for better readability
old_desc_css = '''.hero-lens-desc {
  font-size: clamp(0.76rem, 0.84vw, 0.86rem);
  line-height: 1.42;
  color: #4b5563;
  max-width: 480px;
  margin: 0 auto 14px;
  font-weight: 500;
  text-align: center;
}'''

new_desc_css = '''.hero-lens-desc {
  font-size: clamp(0.85rem, 0.96vw, 0.98rem);
  line-height: 1.55;
  color: #4b5563;
  max-width: 500px;
  margin: 0 auto 18px;
  font-weight: 500;
  text-align: center;
}'''

css = css.replace(old_desc_css, new_desc_css)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Saved style.css')

