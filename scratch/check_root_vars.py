with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
root_match = re.search(r':root\s*\{([^}]+)\}', text)
if root_match:
    print('CSS Root Variables:')
    for line in root_match.group(1).split(';'):
        if line.strip():
            print('  ', line.strip())

