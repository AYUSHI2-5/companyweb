import re

files = [
    'index.html',
    'portfolio.html',
    'services.html',
    'about.html',
    'contact.html',
    'services/website-development/index.html',
    'services/application-development/index.html',
    'services/digital-marketing/index.html'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    footer_m = re.search(r'<footer[^>]*>.*?</footer>', html, re.DOTALL)
    if not footer_m:
        print(f"{fpath}: NO FOOTER!")
        continue
    footer = footer_m.group(0)
    has_grid = 'class="footer-grid"' in footer
    has_brand = 'class="footer-col footer-col-brand"' in footer
    has_bottom = 'class="footer-bottom-bar"' in footer
    print(f"{fpath}: has grid: {has_grid}, brand: {has_brand}, bottom: {has_bottom}")

