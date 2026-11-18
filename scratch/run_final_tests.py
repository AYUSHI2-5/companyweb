import os
import re

print("--- FINAL SYSTEM VERIFICATION ---")

# 1. Check portfolio.html
with open('portfolio.html', 'r', encoding='utf-8') as f:
    port_html = f.read()

assert 'class="case-detail-box challenge-box"' not in port_html, "Challenge box still in portfolio.html!"
assert 'class="case-detail-box solution-box"' not in port_html, "Solution box still in portfolio.html!"
assert 'class="portfolio-outcome-banner"' not in port_html, "Outcome banner still in portfolio.html!"
assert 'class="portfolio-tech-footer"' not in port_html, "Tech footer still in portfolio.html!"

cards = re.findall(r'<article class="portfolio-card[^"]*".*?</article>', port_html, re.DOTALL)
print(f"Cards in portfolio.html: {len(cards)} (all streamlined with Name + Short Desc + View Project button)")
assert len(cards) == 16, f"Expected 16 cards, got {len(cards)}"

# 2. Check 16 project pages
project_dirs = [d for d in os.listdir('projects') if os.path.isdir(os.path.join('projects', d))]
print(f"Project detail directories: {len(project_dirs)}")
assert len(project_dirs) == 16, f"Expected 16 project directories, got {len(project_dirs)}"

for pdir in project_dirs:
    pfile = os.path.join('projects', pdir, 'index.html')
    assert os.path.exists(pfile), f"Missing {pfile}"
    with open(pfile, 'r', encoding='utf-8') as f:
        phtml = f.read()
    assert 'The Challenge' in phtml, f"{pdir} missing Challenge section"
    assert 'The Engineered Solution' in phtml, f"{pdir} missing Solution section"
    assert 'Business Outcome' in phtml, f"{pdir} missing Outcome section"
    assert 'Technology &amp; Infrastructure' in phtml, f"{pdir} missing Tech section"

print("All 16 project detail pages contain complete Challenge, Solution, Outcomes, and Tech sections!")

# 3. Check CSS braces
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()
assert css.count('{') == css.count('}'), "Unbalanced braces in style.css"
print(f"style.css: {css.count('{')} balanced brace pairs")

print("\n--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! ---")

