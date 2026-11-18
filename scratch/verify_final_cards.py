with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
articles = re.findall(r'<article class="portfolio-card[^"]*".*?</article>', text, re.DOTALL)
print(f"Total articles found: {len(articles)}")

for i, art in enumerate(articles, 1):
    title_m = re.search(r'<h2 class="portfolio-card-title">(.*?)</h2>', art)
    kicker_m = re.search(r'<div class="portfolio-card-kicker">(.*?)</div>', art)
    desc_m = re.search(r'<p class="portfolio-card-desc">(.*?)</p>', art)
    action_m = re.search(r'<a\s+href="([^"]*)"\s+class="btn-portfolio-view"', art)
    
    title = title_m.group(1) if title_m else "no-title"
    desc = desc_m.group(1)[:50] + "..." if desc_m else "NO DESC"
    action = action_m.group(1) if action_m else "NO ACTION"
    print(f"#{i}: {title} | Link: {action} | Desc: {desc}")

