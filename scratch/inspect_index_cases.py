with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find case-studies-section
cs_match = re.search(r'<section[^>]*id=["\']case-studies-section["\'].*?</section>', text, re.DOTALL)
if cs_match:
    print('Found case-studies-section in index.html, length:', len(cs_match.group(0)))
    tabs = re.findall(r'<button class="case-tab[^"]*".*?</button>', cs_match.group(0), re.DOTALL)
    print(f'Count of case tabs in index.html: {len(tabs)}')
    for t in tabs:
        print(' ', re.sub(r'\s+', ' ', t).strip())

    slides = re.findall(r'<div class="case-card-slide[^"]*".*?</div>\s*<!-- /slide', cs_match.group(0), re.DOTALL)
    print(f'Count of case slides: {len(slides)}')
    if not slides:
        # let's look for slides with another pattern
        slides = re.findall(r'class="[^"]*case-card-slide[^"]*"', cs_match.group(0))
        print(f'Slide class matches: {len(slides)}')

