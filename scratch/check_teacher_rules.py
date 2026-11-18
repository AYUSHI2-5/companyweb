with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'[^{}]*teacher[^{}]*\{[^}]*\}', text)
print(f"Found {len(matches)} teacher rules")
for m in matches[:6]:
    print(m.strip()[:160])
    print("-" * 30)

