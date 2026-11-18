with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
links = re.findall(r'<a[^>]*class=["\']service-card-action["\'][^>]*href=["\']([^"\']*)["\']', text)
print('Updated action links in services.html:', len(links))
for l in links:
    print('  ', l)

