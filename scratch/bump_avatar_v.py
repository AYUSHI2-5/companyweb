for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    c = open(f, encoding='utf-8').read()
    c = c.replace('teacher-pointing-arm.png?v=9', 'teacher-pointing-arm.png?v=10')
    c = c.replace('teacher-pointing-body.png?v=9', 'teacher-pointing-body.png?v=10')
    open(f, 'w', encoding='utf-8').write(c)
    print(f'Updated {f} avatar cache-busters to v=10')

