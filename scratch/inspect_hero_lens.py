import re

css = open('style.css', encoding='utf-8').read()

selectors = ['hero-lens-container', 'hero-interactive-wrap', 'hero-top-badge', 'hero-lens-circle', 'hero-lens-headline', 'hero-lens-desc']

for s in selectors:
    matches = re.findall(rf'(\.{s}\b[^{{]*\{{[^}}]*\}})', css)
    for m in matches[:2]:
        print(f'=== {s} ===\n{m}')

