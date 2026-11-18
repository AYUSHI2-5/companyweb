with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find('main.js')
if idx != -1:
    print(text[idx-100:idx+100])
