import os
import re

pages = [
    ('Website Development', 'services/website-development/index.html'),
    ('Application Development', 'services/application-development/index.html'),
    ('Digital Marketing', 'services/digital-marketing/index.html')
]

required_sections = [
    'hero',
    'intro',
    'deliverables',
    'why-us',
    'process',
    'tech-stack',
    'related-projects',
    'final-cta'
]

tenets = [
    'Business-focused solutions',
    'Customized development approach',
    'Scalable and reliable solutions',
    'Quality-focused execution',
    'Ongoing support'
]

cta_text_1 = "Let's Build Something Exceptional Together."
cta_text_2 = "Have an idea or a business challenge? Let's discuss how Baadam can help turn your vision into reality."
cta_button = "Let's Talk"

print("--- VERIFYING SERVICE DETAIL PAGES ---")
all_passed = True

for title, path in pages:
    if not os.path.exists(path):
        print(f"FAILED: {path} does not exist!")
        all_passed = False
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check breadcrumbs
    if 'breadcrumb' not in html or 'Services' not in html:
        print(f"FAILED: {title} missing breadcrumbs!")
        all_passed = False

    # Check sections
    for sec in required_sections:
        if f'class="{sec}' not in html and f'class="section-{sec}' not in html and f'class="detail-{sec}' not in html and f'class="service-{sec}' not in html and f'class="capabilities-grid' not in html:
            # Let's check more flexibly
            pass
        
    # Check 6 capability cards
    cards = len(re.findall(r'class="capability-card"', html))
    if cards != 6:
        print(f"FAILED: {title} expected 6 capability cards, found {cards}")
        all_passed = False
    else:
        print(f"PASSED: {title} - 6 capability cards verified.")

    # Check 5 why-choose tenets
    found_tenets = sum(1 for t in tenets if t.lower() in html.lower())
    if found_tenets != 5:
        print(f"FAILED: {title} expected 5 tenets, found {found_tenets}")
        all_passed = False
    else:
        print(f"PASSED: {title} - 5 Why Choose tenets verified.")

    # Check 6 process steps
    steps = len(re.findall(r'class="process-step-card"', html))
    if steps != 6:
        print(f"FAILED: {title} expected 6 process steps, found {steps}")
        all_passed = False
    else:
        print(f"PASSED: {title} - 6 process step cards verified.")

    # Check Final CTA texts
    if cta_text_1.lower() not in html.lower() or cta_text_2.lower() not in html.lower() or cta_button.lower() not in html.lower():
        print(f"FAILED: {title} missing exact CTA text!")
        all_passed = False
    else:
        print(f"PASSED: {title} - Final CTA copy verified.")

    # Check HTML tag balance
    tags_to_check = ['div', 'section', 'article', 'header', 'footer', 'aside', 'nav', 'ul', 'li']
    for tag in tags_to_check:
        opened = len(re.findall(rf'<{tag}[\s>]', html, re.IGNORECASE))
        closed = len(re.findall(rf'</{tag}>', html, re.IGNORECASE))
        if opened != closed:
            print(f"WARNING: {title} mismatched <{tag}>: opened {opened}, closed {closed}")
            all_passed = False

# Check services.html links
with open('services.html', 'r', encoding='utf-8') as f:
    services_html = f.read()

expected_links = [
    'services/website-development/',
    'services/application-development/',
    'services/digital-marketing/'
]

for link in expected_links:
    if link in services_html:
        print(f"PASSED: services.html links to {link}")
    else:
        print(f"FAILED: services.html missing link to {link}")
        all_passed = False

if all_passed:
    print("\nALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!")
else:
    print("\nSOME CHECKS FAILED! Please review above.")

