import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<header class="site-header"[\s\S]*?</header>', text)
if m:
    print(m.group(0))
    with open('scratch/exact_navbar.html', 'w', encoding='utf-8') as f_out:
        f_out.write(m.group(0))

