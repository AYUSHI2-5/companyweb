with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
hero_match = re.search(r'<section class="page-hero.*?</section>', text, re.DOTALL)
if hero_match:
    print('Hero in about.html:\n', hero_match.group(0)[:1200])

with open('services.html', 'r', encoding='utf-8') as f:
    s_text = f.read()
s_hero = re.search(r'<section class="[^"]*services-showcase.*?</section>', s_text, re.DOTALL)
if s_hero:
    print('\nHero in services.html:\n', s_hero.group(0)[:1000])

