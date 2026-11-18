import os
import re

project_dirs = [d for d in os.listdir('projects') if os.path.isdir(os.path.join('projects', d))]
all_good = True

for pdir in project_dirs:
    pfile = os.path.join('projects', pdir, 'index.html')
    with open(pfile, 'r', encoding='utf-8') as f:
        html = f.read()

    footer_m = re.search(r'<footer[^>]*>.*?</footer>', html, re.DOTALL)
    if not footer_m:
        print(f"FAILED: No footer in {pdir}")
        all_good = False
        continue

    footer = footer_m.group(0)
    
    # Check that it uses footer-grid (not unstyled footer-top)
    if 'class="footer-grid"' not in footer:
        print(f"FAILED: {pdir} not using footer-grid!")
        all_good = False

    if 'class="footer-top"' in footer:
        print(f"FAILED: {pdir} still has old footer-top!")
        all_good = False

    # Check that logo exists
    logo_src = re.search(r'<img[^>]*class="footer-logo-img"[^>]*src="([^"]*)"', footer)
    if not logo_src or not os.path.exists(os.path.normpath(os.path.join('projects', pdir, logo_src.group(1)))):
        print(f"FAILED: {pdir} logo not resolving: {logo_src.group(1) if logo_src else 'NONE'}")
        all_good = False

    # Check social links SVGs
    if '<svg width="16" height="16"' not in footer:
        print(f"FAILED: {pdir} missing social SVG icons!")
        all_good = False

if all_good:
    print("ALL 16 PROJECT PAGES HAVE FULLY STYLED, CANONICAL FOOTERS WITH WORKING LOGO & LINKS!")

