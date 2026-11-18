import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

links = re.findall(r'href="(projects/[^"]+)"', text)
print(f'Total project links in index.html: {len(links)}')
for l in links[:6]:
    print('  ', l)

