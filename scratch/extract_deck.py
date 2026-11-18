with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<div class="portfolio-showcase-deck">.*?</div>\s*</div>\s*</section>', text, re.DOTALL)
if m:
    print('Found showcase deck, length:', len(m.group(0)))
    with open('scratch/found_deck.txt', 'w', encoding='utf-8') as out:
        out.write(m.group(0))
    print('Wrote to scratch/found_deck.txt')

