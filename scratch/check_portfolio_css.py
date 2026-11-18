with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'(\.portfolio-grid[^{]*|\.portfolio-card[^{]*|\.portfolio-filter[^{]*)\{([^}]+)\}', css)
for sel, body in matches:
    print(sel.strip())
    for line in body.split(';'):
        if any(k in line for k in ['grid', 'display', 'gap', 'margin', 'padding', 'width', 'transition']):
            print('  ', line.strip())

