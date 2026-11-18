css = open('style.css', encoding='utf-8').read()
lines = css.split('\n')
for i, l in enumerate(lines):
    if 'map' in l.lower() and ('{' in l or '.' in l):
        print(f'{i+1}: {l.strip()}')

