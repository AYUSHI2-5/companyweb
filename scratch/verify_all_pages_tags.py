import os
import re

files_to_check = [
    'index.html',
    'portfolio.html',
    'about.html',
    'services.html',
    'contact.html'
]

# Add services detail pages
for s in os.listdir('services'):
    sdir = os.path.join('services', s)
    if os.path.isdir(sdir):
        files_to_check.append(os.path.join(sdir, 'index.html'))

# Add project detail pages
for p in os.listdir('projects'):
    pdir = os.path.join('projects', p)
    if os.path.isdir(pdir):
        files_to_check.append(os.path.join(pdir, 'index.html'))

tags = ['div', 'footer', 'header', 'nav', 'article', 'section', 'ul', 'li', 'ol', 'p', 'h1', 'h2', 'h3', 'h4', 'span', 'a']
all_passed = True

for fpath in files_to_check:
    with open(fpath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    for tag in tags:
        op = len(re.findall(rf'<{tag}(\s+[^>]*?)?>', html, re.IGNORECASE))
        cl = len(re.findall(rf'</{tag}>', html, re.IGNORECASE))
        if op != cl:
            print(f"Mismatch in {fpath} for <{tag}>: {op} opened vs {cl} closed")
            all_passed = False

if all_passed:
    print(f"SUCCESS: All {len(files_to_check)} pages have 100% balanced tags!")

