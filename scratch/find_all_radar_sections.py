import re

css = open('style.css', encoding='utf-8').read()

matches = re.finditer(r'radar-section', css)
lines = css.split('\n')
for i, l in enumerate(lines):
    if 'radar-section' in l:
        print(f'{i+1}: {l.strip()}')

