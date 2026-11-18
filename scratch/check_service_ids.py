import re

with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

items = re.findall(r'<div[^>]*class="[^"]*(?:accordion|service-item|service-card)[^"]*"[^>]*>[\s\S]*?</div>', text)
print(f'Found {len(items)} service items')

# search for IDs in services.html
ids = re.findall(r'id="([^"]+)"', text)
print('IDs in services.html:', [i for i in ids if 'serv' in i.lower() or 'dev' in i.lower()])
