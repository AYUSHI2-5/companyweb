with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
articles = re.findall(r'<article class="service-card[^"]*" id="([^"]*)".*?<h2 class="service-card-title">(.*?)</h2>.*?<a href="([^"]*)" class="service-card-action"', text, re.DOTALL)
print(f"Total service cards with links found: {len(articles)}")
for aid, title, href in articles:
    clean_title = title.replace('<br>', ' ').strip()
    print(f" - [{aid}] {clean_title} -> {href}")

