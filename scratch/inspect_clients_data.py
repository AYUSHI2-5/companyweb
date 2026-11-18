with open('case-study-slider.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
match = re.search(r'var clientsData = \[.*?\];', text, re.DOTALL)
if match:
    print('Found clientsData in case-study-slider.js, length:', len(match.group(0)))

