with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'[^{}]*(?:service-acc|services-pinned|services-sticky)[^{}]*\{[^}]*\}', text)
print(f"Found {len(matches)} CSS rules related to services accordion/sticky")
for m in matches[:15]:
    print(m.strip()[:150])
    print("-" * 30)

