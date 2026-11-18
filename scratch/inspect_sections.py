with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
cs_match = re.search(r'<section[^>]*id=["\']case-studies-section["\'].*?</section>', text, re.DOTALL)
if cs_match:
    lines = cs_match.group(0).split('\n')
    print('case-studies-section first 40 lines:')
    for line in lines[:40]:
        print(line)

ps_match = re.search(r'<section[^>]*id=["\']portfolio-showcase-section["\'].*?</section>', text, re.DOTALL)
if ps_match:
    lines = ps_match.group(0).split('\n')
    print('\nportfolio-showcase-section first 40 lines:')
    for line in lines[:40]:
        print(line)

