import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<section[^>]*class="[^"]*case-studies-section[^"]*"[^>]*>[\s\S]*?</section>', text)
if m:
    print(m.group(0)[:2500])

