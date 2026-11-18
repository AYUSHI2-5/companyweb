with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Look for breadcrumb, process, capability, badge, timeline styles
keywords = ['breadcrumb', 'process', 'timeline', 'capability', 'service-detail', 'page-hero', 'deliver', 'why-choose', 'tech-badge']
for kw in keywords:
    matches = re.findall(rf'(\.[^{{]*{kw}[^{{]*)\{{', text, re.IGNORECASE)
    print(f'Keyword "{kw}": {len(matches)} selectors found')
    for m in matches[:5]:
        print('  ', m.strip())

