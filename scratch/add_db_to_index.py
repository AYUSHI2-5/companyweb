with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '<script src="main.js?v=28" defer></script>'
replacement = '<script src="project-database.js" defer></script>\n  <script src="main.js?v=28" defer></script>'

if 'project-database.js' not in html:
    html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Added project-database.js to index.html')
else:
    print('project-database.js already present in index.html')

