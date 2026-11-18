with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
card1 = re.search(r'<article[^>]*class="[^"]*portfolio-item[^"]*"[^>]*>.*?</article>', text, re.DOTALL)
if card1:
    print(card1.group(0)[:1200])

