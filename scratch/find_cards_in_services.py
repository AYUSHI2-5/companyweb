with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<[^>]+id="(?:web-dev|app-dev|marketing-seo|ecommerce|software-dev|game-dev)"[^>]*>', text)
print("Matches by ID:")
for m in matches:
    print(m)

# Find Explore Capability
pos = 0
while True:
    pos = text.find('Explore Capability', pos)
    if pos == -1:
        break
    print("Found 'Explore Capability' snippet:")
    print(text[max(0, pos-100):min(len(text), pos+150)])
    print("-" * 40)
    pos += len('Explore Capability')

