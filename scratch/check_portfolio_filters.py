import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

cats = re.findall(r'data-category="([^"]+)"', text)
print('Categories in portfolio.html:', set(cats))

filters = re.findall(r'data-filter="([^"]+)"', text)
print('Filters in portfolio.html:', set(filters))
