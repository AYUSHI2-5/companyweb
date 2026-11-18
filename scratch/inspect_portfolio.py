import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of portfolio.html:', len(text))

# Find filter buttons
filters = re.findall(r'<button[^>]*data-filter=[^>]*>.*?</button>', text, re.DOTALL | re.IGNORECASE)
print('Filter buttons:')
for btn in filters:
    print(' ', re.sub(r'\s+', ' ', btn).strip())

# Find card elements
cards = re.findall(r'(<(?:article|div)[^>]*class=["\'][^"\']*(?:project|portfolio|case-card)[^"\']*["\'][^>]*data-category=["\'][^"\']*["\'][^>]*>)', text, re.IGNORECASE)
print('\nProject cards count with data-category:', len(cards))
for c in cards[:10]:
    print(' ', c)

with open('index.html', 'r', encoding='utf-8') as f:
    idx_text = f.read()

idx_filters = re.findall(r'<button[^>]*data-filter=[^>]*>.*?</button>', idx_text, re.DOTALL | re.IGNORECASE)
print('\nFilter buttons in index.html:')
for btn in idx_filters:
    print(' ', re.sub(r'\s+', ' ', btn).strip())

idx_cards = re.findall(r'(<(?:article|div)[^>]*class=["\'][^"\']*(?:project|portfolio|case-card)[^"\']*["\'][^>]*data-category=["\'][^"\']*["\'][^>]*>)', idx_text, re.IGNORECASE)
print('\nProject cards count in index.html with data-category:', len(idx_cards))
for c in idx_cards[:10]:
    print(' ', c)

