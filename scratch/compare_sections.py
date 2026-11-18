import re

css = open('style.css', encoding='utf-8').read()

sections = ['hero-section', 'radar-section', 'services-section', 'portfolio-showcase-section', 'case-studies-section', 'funnel-section', 'cta-banner-section']

for s in sections:
    print(f'=== {s} ===')
    matches = re.findall(rf'(\.{s}\b[^{{]*\{{[^}}]*\}})', css)
    for m in matches[:2]:
        print(m)
    matches_c = re.findall(rf'(\.{s}\s+\.section-container\b[^{{]*\{{[^}}]*\}})', css)
    for mc in matches_c:
        print(mc)

