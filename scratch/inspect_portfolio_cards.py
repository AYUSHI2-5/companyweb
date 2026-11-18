import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find all project cards or articles
cards = re.findall(r'<article[^>]*class="[^"]*portfolio-item[^"]*"[^>]*>.*?</article>', text, re.DOTALL)
if not cards:
    cards = re.findall(r'<article[^>]*>.*?</article>', text, re.DOTALL)

print(f"Total cards found: {len(cards)}")
for i, c in enumerate(cards, 1):
    title_m = re.search(r'<h[234][^>]*>(.*?)</h[234]>', c)
    title = title_m.group(1).strip() if title_m else "no-title"
    cat_m = re.search(r'data-category="([^"]*)"', c)
    cat = cat_m.group(1) if cat_m else "no-cat"
    btn_m = re.search(r'<a[^>]*>(.*?)</a>', c)
    btn = btn_m.group(1).strip() if btn_m else "no-button"
    print(f"{i}. [{cat}] {title} | Action: {btn}")

