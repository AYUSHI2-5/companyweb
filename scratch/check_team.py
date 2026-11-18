with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
names = re.findall(r'<h3 class="team-card-name">([^<]+)</h3>\s*<div class="team-card-role">([^<]+)</div>', text)
for n, r in names:
    print(f'- {n}: {r}')

