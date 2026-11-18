import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<section class="[^"]*cta-banner-section[^"]*"[\s\S]*?</section>', text)
if m:
    print(m.group(0))

