import re

with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find service titles / sections
service_cards = re.findall(r'<h[23][^>]*>(.*?)</h[23]>', text)
for t in service_cards[:20]:
    print('Title:', t.strip())

# Look for service links or accordion items
links = re.findall(r'<a[^>]*href="([^"]*(?:service|app|web|cloud|ai|marketing)[^"]*)"[^>]*>(.*?)</a>', text, re.IGNORECASE)
for l in links[:15]:
    print('Link:', l)
