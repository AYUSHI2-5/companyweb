import os
import re

files_to_check = [
    'index.html',
    'portfolio.html',
    'services.html',
    'about.html',
    'contact.html',
    'projects/kp-e-services/index.html',
    'services/website-development/index.html'
]

for fpath in files_to_check:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    footer_m = re.search(r'<footer[^>]*>.*?</footer>', text, re.DOTALL)
    if footer_m:
        footer = footer_m.group(0)
        # Check classes and main divs
        classes = re.findall(r'class="([^"]*)"', footer)
        print("=" * 60)
        print(f"File: {fpath}")
        print(f"Footer classes: {set(classes[:10])}")
        print("Footer snippet:")
        print("\n".join(footer.splitlines()[:25]))
    else:
        print(f"NO FOOTER FOUND in {fpath}")

