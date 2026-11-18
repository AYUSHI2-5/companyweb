import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<section[^>]*class="[^"]*case-studies-section[^"]*"[^>]*>[\s\S]*?</section>', text)
if m:
    sec = m.group(0)
    cards = re.findall(r'<article[^>]*>[\s\S]*?</article>', sec)
    print(f'Total cards in index.html portfolio section: {len(cards)}')
    for idx, c in enumerate(cards):
        title = re.search(r'<h[234][^>]*>(.*?)</h[234]>', c)
        print(f"Card {idx+1}: {title.group(1) if title else 'No title'}")

