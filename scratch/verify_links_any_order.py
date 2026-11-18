with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<a[^>]*class="service-card-action"[^>]*>|<a[^>]*href="([^"]*)"[^>]*class="service-card-action"', text)
links = re.findall(r'<a\s+href="([^"]*)"\s+class="service-card-action"', text)
print('Found action links in services.html:', len(links))
for l in links:
    print('  ', l)

