import re

for p in ['index.html', 'about.html', 'services.html', 'portfolio.html']:
    with open(p, 'r', encoding='utf-8') as f:
        t = f.read()
    v = re.findall(r'<div class="cta-banner-visual"[\s\S]*?</div>\s*</div>', t)
    print(p, len(v))
    if v:
        print(v[0][:200])

