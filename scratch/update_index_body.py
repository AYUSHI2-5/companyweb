with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('<body>', '<body class="has-snap-nav">', 1)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated index.html')

