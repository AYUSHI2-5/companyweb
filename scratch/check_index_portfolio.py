import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<section[^>]*id="portfolio"[^>]*>[\s\S]*?</section>', text)
if not m:
    m = re.search(r'<section[^>]*class="[^"]*case-studies-section[^"]*"[^>]*>[\s\S]*?</section>', text)

if m:
    print('Found section, length:', len(m.group(0)))
    print(m.group(0)[:600])
else:
    print('Section not found directly, searching for portfolio keyword...')
    for line in text.splitlines():
        if 'case-studies' in line or 'portfolio' in line:
            print('  ', line[:100])

