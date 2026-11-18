import re

with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of services.html:', len(text))

# Find explore buttons
explore_btns = re.findall(r'<a[^>]*>.*?explore.*?</a>', text, re.IGNORECASE | re.DOTALL)
print('Explore buttons found:', len(explore_btns))
for b in explore_btns:
    print('  ', re.sub(r'\s+', ' ', b).strip())

# Find service card headings and ids
headers = re.findall(r'(<(?:article|div|section)[^>]*id=["\'][^"\']*["\'][^>]*class=["\'][^"\']*service[^"\']*["\'][^>]*>.*?(?:<h2|<h3)[^>]*>.*?<\/(?:h2|h3)>)', text, re.DOTALL | re.IGNORECASE)
print('\nService card headers found:', len(headers))
for h in headers:
    clean = re.sub(r'\s+', ' ', h).strip()
    print('  ', clean[:150])

