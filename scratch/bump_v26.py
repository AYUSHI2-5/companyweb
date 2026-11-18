for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    c = open(f, encoding='utf-8').read()
    c = c.replace('style.css?v=25', 'style.css?v=26')
    open(f, 'w', encoding='utf-8').write(c)
    print(f'Updated {f} to style.css?v=26')

