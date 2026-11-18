import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.finditer(r'<section([^>]*)>', text)
for i, m in enumerate(matches):
    attrs = m.group(1)
    # find line number
    line_num = text[:m.start()].count('\n') + 1
    print(f'Line {line_num}: <section {attrs.strip()}>')
