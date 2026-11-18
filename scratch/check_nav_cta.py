import re

for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    c = open(f, encoding='utf-8').read()
    m = re.findall(r'<div class="nav-cta-wrapper">[\s\S]*?</div>', c)
    if m:
        print(f, ':', m[0].strip().replace('\n', ' '))

