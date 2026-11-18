with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line for line in text.split('\n') if any(k in line.lower() for k in ['service-showcase-card', 'service-card-action', 'explore capability', 'web-dev', 'app-dev'])]
print('Matches in main.js:')
for m in matches:
    print('  ', m.strip())

