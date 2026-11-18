with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
articles = re.findall(r'<article class="service-card[^"]*".*?</article>', text, re.DOTALL)
print(f"Total service cards found: {len(articles)}")
for i, art in enumerate(articles, 1):
    id_m = re.search(r'id="([^"]*)"', art)
    title_m = re.search(r'<h2 class="service-card-title">(.*?)</h2>', art, re.DOTALL)
    link_m = re.search(r'<a\s+href="([^"]*)"\s+class="service-card-action"', art)
    if not link_m:
        link_m = re.search(r'<a\s+class="service-card-action"\s+href="([^"]*)"', art)
    
    cid = id_m.group(1) if id_m else "no-id"
    ctitle = title_m.group(1).replace('<br>', ' ').strip() if title_m else "no-title"
    clink = link_m.group(1) if link_m else "NO LINK FOUND"
    print(f"Card {i}: [{cid}] {ctitle} -> {clink}")

