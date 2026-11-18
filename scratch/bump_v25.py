for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    c = open(f, encoding='utf-8').read()
    c = c.replace('style.css?v=24', 'style.css?v=25')
    c = c.replace('style.css?v=23', 'style.css?v=25')
    c = c.replace('style.css?v=22', 'style.css?v=25')
    c = c.replace('main.js?v=22', 'main.js?v=25')
    c = c.replace('main.js?v=13', 'main.js?v=25')
    open(f, 'w', encoding='utf-8').write(c)
    print(f'Updated {f} to v=25')

