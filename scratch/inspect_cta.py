with open('services/website-development/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
cta_match = re.search(r'<section[^>]*class="[^"]*final-cta[^"]*"[^>]*>(.*?)</section>', text, re.DOTALL)
if cta_match:
    print(cta_match.group(0))
else:
    # search for "Exceptional"
    pos = text.find("Exceptional")
    print(text[pos-100:pos+300])

