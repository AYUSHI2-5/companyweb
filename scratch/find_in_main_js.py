with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'services-section|services-sticky|snap-nav', text)]
for idx in matches:
    print(text[max(0, idx-100):min(len(text), idx+200)])
    print("=" * 50)

