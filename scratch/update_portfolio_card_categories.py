with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add creative tag
text = text.replace('<!-- Project 08: Cyclical Beauty -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web">',
                    '<!-- Project 08: Cyclical Beauty -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web creative">')

text = text.replace('<!-- Project 06: Chick N Go -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="mobile">',
                    '<!-- Project 06: Chick N Go -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="mobile creative">')

text = text.replace('<!-- Project 05: Vishan Institute of Technology -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web">',
                    '<!-- Project 05: Vishan Institute of Technology -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web creative">')

# Add marketing tag
text = text.replace('<!-- Project 13: RealtyBizHub -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web">',
                    '<!-- Project 13: RealtyBizHub -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="web marketing">')

text = text.replace('<!-- Project 16: Micro Matching -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="enterprise">',
                    '<!-- Project 16: Micro Matching -->\n          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="enterprise marketing">')

with open('portfolio.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated portfolio.html categories successfully')
