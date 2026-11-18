for s in ['services/website-development/index.html', 'services/application-development/index.html', 'services/digital-marketing/index.html']:
    with open(s, 'r', encoding='utf-8') as f:
        text = f.read()
    has_grid = 'class="footer-grid"' in text
    print(f"{s}: has .footer-grid: {has_grid}")

