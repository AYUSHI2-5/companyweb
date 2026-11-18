with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

match = re.search(r'portfolio-filter-btn.*?(?=\n\s*(?:/\*|function|\Z))', text, re.DOTALL)
if match:
    print('Filter logic in main.js:\n', match.group(0)[:1200])
else:
    print('Searching for filter in main.js:')
    for line in text.split('\n'):
        if 'filter' in line.lower() and ('portfolio' in line.lower() or 'category' in line.lower()):
            print(' ', line.strip())

