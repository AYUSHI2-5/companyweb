with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'[^{}]*scroll-snap[^{}]*\{[^}]*\}', text)
for m in matches:
    print(m.strip())
    print("-" * 40)

