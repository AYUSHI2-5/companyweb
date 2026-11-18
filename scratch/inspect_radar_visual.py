import re

css = open('style.css', encoding='utf-8').read()

matches = re.findall(r'(\.radar-visual[^{]*\{[^}]*\})', css)
for m in matches:
    print(m)

matches2 = re.findall(r'(\.brand-radar-canvas[^{]*\{[^}]*\})', css)
for m in matches2:
    print(m)

matches3 = re.findall(r'(\.radar-content[^{]*\{[^}]*\})', css)
for m in matches3:
    print(m)

