import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's find services section in index.html
matches = re.findall(r'<section[^>]*id="[^"]*servic[^"]*"[^>]*>.*?</section>', html, re.DOTALL | re.IGNORECASE)
if not matches:
    # search for services in section tags
    sec_tags = re.findall(r'<section[^>]*>', html)
    for s in sec_tags:
        if 'service' in s.lower():
            print("Found section tag:", s)
else:
    print(f"Found {len(matches)} service sections matching regex")

# Let's search for "services" or "service" in index.html section IDs or classes
for line_no, line in enumerate(html.splitlines(), 1):
    if '<section' in line:
        print(f"Line {line_no}: {line.strip()[:100]}")

