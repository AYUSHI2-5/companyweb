import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

cards = re.findall(r'<article[^>]*class="[^"]*portfolio-card[^"]*"[^>]*>[\s\S]*?</article>', text)
print(f'Total cards in portfolio.html: {len(cards)}')
for idx, c in enumerate(cards[:5]):
    title = re.search(r'<h[234][^>]*>(.*?)</h[234]>', c)
    print(f"Card {idx+1}: {title.group(1) if title else 'No title'}")

