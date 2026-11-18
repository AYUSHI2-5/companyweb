with open('main.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
matches = re.findall(r'(?:function|const|let|var)\s+[\w$]*(?:portfolio|case|project)[\w$]*', code, re.IGNORECASE)
print('Portfolio/case symbols in main.js:', set(matches))

