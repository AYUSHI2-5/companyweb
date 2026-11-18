with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
items = re.findall(r'<article class="service-acc-item[^"]*" data-index="(\d+)".*?<h3 class="acc-title">(.*?)</h3>', text, re.DOTALL)
for idx, title in items:
    print(f"Service {idx}: {title.strip()}")

