with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'[^{}]*\.cta-banner-[^{}]*\{[^}]*\}', text)
print(f"Found {len(matches)} rules for cta-banner")
for m in matches[:15]:
    print(m.strip())
    print("-" * 40)

