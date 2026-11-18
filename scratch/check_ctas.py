import re

for page in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    try:
        with open(page, 'r', encoding='utf-8') as f:
            t = f.read()
        m = re.search(r'<div class="cta-banner-content">([\s\S]*?)</div>\s*</div>', t)
        if m:
            print(f'=== {page} ===')
            print(m.group(0))
    except Exception as e:
        print(f'{page}: {e}')

