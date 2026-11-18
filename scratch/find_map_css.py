import re

css = open('style.css', encoding='utf-8').read()

matches = re.findall(r'(\.map-location-card[^{]*\{[^}]*\})', css)
for m in matches:
    print('card:', m)

matches2 = re.findall(r'(\.contact-map-[^{]*\{[^}]*\})', css)
for m in matches2:
    print('frame:', m)

