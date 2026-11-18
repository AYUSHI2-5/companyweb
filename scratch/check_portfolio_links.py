import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

links = re.findall(r'href="(projects/[^"]+)"', text)
print(f'Total project links in portfolio.html: {len(links)}')
for l in links[:6]:
    print('  ', l)

