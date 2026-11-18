with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\.service-card-action[^{]*|\.service-action-text[^{]*|\.service-action-arrow[^{]*)\{([^}]+)\}', text)
for sel, body in matches:
    print(sel.strip(), ':')
    for line in body.split(';'):
        if line.strip():
            print('  ', line.strip())

