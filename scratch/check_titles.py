with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
titles = re.findall(r'<h2 class="portfolio-card-title">(.*?)</h2>', text)
print(f"Total titles found: {len(titles)}")
for t in titles:
    print(" -", t)

