with open('case-study-slider.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
items = re.findall(r'\{\s*id:\s*\'[^\']+\'.*?ctaUrl:\s*\'[^\']+\'\s*\}', text, re.DOTALL)
print(f'Total items in clientsData: {len(items)}')
for i, it in enumerate(items):
    id_m = re.search(r'id:\s*\'([^\']+)\'', it)
    name_m = re.search(r'name:\s*\'([^\']+)\'', it)
    print(f'{i+1}: {id_m.group(1) if id_m else ""} -> {name_m.group(1) if name_m else ""}')

