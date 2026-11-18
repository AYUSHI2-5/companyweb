with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
items = re.findall(r'<article class="service-acc-item[^"]*".*?</article>', text, re.DOTALL)
print(f"Total service accordion items: {len(items)}")
for i, item in enumerate(items, 1):
    body = re.search(r'<div class="service-acc-body"[^>]*>(.*?)</div>\s*</article>', item, re.DOTALL)
    if body:
        first_child = re.search(r'^\s*<div class="([^"]*)"', body.group(1))
        fc = first_child.group(1) if first_child else "other"
        print(f"Item {i}: child is <div class='{fc}'>")

