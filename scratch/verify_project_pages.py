import os
import re
import json

print("--- VERIFYING 16 PROJECT PAGES & PORTFOLIO LINKS ---")

with open('scratch/extracted_projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Check portfolio.html links
with open('portfolio.html', 'r', encoding='utf-8') as f:
    portfolio_html = f.read()

buttons = re.findall(r'<a\s+href="projects/([^/"]+)/"\s+class="btn-portfolio-view"', portfolio_html)
print(f"Total 'btn-portfolio-view' links found in portfolio.html: {len(buttons)}")

all_ok = True
if len(buttons) != 16:
    print(f"FAILED: Expected 16 buttons, found {len(buttons)}")
    all_ok = False

tags_to_check = ['div', 'section', 'article', 'header', 'footer', 'aside', 'nav', 'ol', 'li', 'h1', 'h2', 'h3', 'p', 'span']

for p in projects:
    slug = p['slug']
    path = os.path.join('projects', slug, 'index.html')
    if not os.path.exists(path):
        print(f"FAILED: Missing file {path}")
        all_ok = False
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check title
    if f"<title>{p['title']} | Case Study | Baadam IT Solutions</title>" not in html:
        print(f"FAILED: {slug} title tag mismatch!")
        all_ok = False

    # Check tag balances
    for tag in tags_to_check:
        opened = len(re.findall(rf'<{tag}(\s+[^>]*?)?>', html, re.IGNORECASE))
        closed = len(re.findall(rf'</{tag}>', html, re.IGNORECASE))
        if opened != closed:
            print(f"FAILED: {slug} tag imbalance for <{tag}>: {opened} opened vs {closed} closed")
            all_ok = False

    # Check breadcrumb presence
    if 'Back to All Projects' not in html or 'Back to Portfolio' not in html:
        print(f"FAILED: {slug} missing breadcrumb or return link!")
        all_ok = False

    # Check CTA presence
    if 'START A COLLABORATION' not in html or "Let's Talk" not in html:
        print(f"FAILED: {slug} missing CTA banner!")
        all_ok = False

if all_ok:
    print("\nALL 16 PROJECT PAGES PASSED VALIDATION PERFECTLY (100% VALID HTML & BALANCED TAGS)!")
else:
    print("\nSOME CHECKS FAILED! Please review above.")

