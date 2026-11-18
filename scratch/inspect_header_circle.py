import re

css = open('style.css', encoding='utf-8').read()

matches = re.findall(r'(\.site-header[^{]*\{[^}]*\})', css)
for m in matches:
    print('site-header:', m)

matches2 = re.findall(r'(\.hero-center-circle[^{]*\{[^}]*\})', css)
for m in matches2:
    print('circle:', m)

matches3 = re.findall(r'(\.hero-kicker-pill[^{]*\{[^}]*\})', css)
for m in matches3:
    print('kicker:', m)

