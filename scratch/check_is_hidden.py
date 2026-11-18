with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'\.is-hidden[^{]*\{[^}]+\}', css)
print('Matches for .is-hidden:', matches)

