for p in ['index.html', 'portfolio.html', 'about.html', 'services.html', 'contact.html']:
    with open(p, 'r', encoding='utf-8') as f:
        txt = f.read()
    cs_idx = txt.find('Core Services')
    hq_idx = txt.find('Headquarters')
    sub = txt[cs_idx:hq_idx]
    has_class = 'class="footer-nav-link"' in sub
    print(f"{p}: Core services has footer-nav-link = {has_class}")

