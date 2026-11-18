with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find grid container
grid_match = re.search(r'<div class="portfolio-grid[^"]*".*?</div>\s*</div>\s*</section>', text, re.DOTALL)
if grid_match:
    print('Found portfolio-grid container, length:', len(grid_match.group(0)))
    articles = re.findall(r'<article class="portfolio-card[^"]*".*?</article>', grid_match.group(0), re.DOTALL)
    print(f'Number of articles in portfolio.html: {len(articles)}')
    for i, a in enumerate(articles):
        title = re.search(r'<h2 class="portfolio-card-title">(.*?)</h2>', a)
        cat = re.search(r'data-category="([^"]*)"', a)
        print(f'{i+1}: {title.group(1) if title else "No title"} | Category: {cat.group(1) if cat else "No cat"}')

# Check script in portfolio.html or main.js for filtering
scripts = re.findall(r'<script.*?</script>', text, re.DOTALL)
print('\nScripts in portfolio.html:', len(scripts))
for s in scripts:
    print(s[:200])

