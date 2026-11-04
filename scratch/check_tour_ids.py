pages = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']
tour_ids = ['hero-section', 'radar-section', 'services-section', 'case-studies-section', 'funnel-section', 'cta-section', 'site-footer']
for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    found = [tid for tid in tour_ids if f'id="{tid}"' in c or f"id='{tid}'" in c]
    print(f'{p}: {found} (count: {len(found)})')

