import re

css = open('style.css', encoding='utf-8').read()

matches = re.findall(r'(@media[^{]*\{[^{]*radar[^{]*\{[^}]*\}[^}]*\})', css)
for m in matches:
    print(m)

