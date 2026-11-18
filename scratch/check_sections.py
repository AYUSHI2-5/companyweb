import re

files = [
    'services/website-development/index.html',
    'services/application-development/index.html',
    'services/digital-marketing/index.html'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    print("="*50)
    print(fpath)
    
    deliv_cards = re.findall(r'class="deliverable-feature-card[^"]*"', text)
    print(f"Deliverable feature cards: {len(deliv_cards)}")
    
    why_cards = re.findall(r'class="why-baadam-card[^"]*"', text)
    print(f"Why Baadam cards: {len(why_cards)}")
    
    proc_cards = re.findall(r'class="process-step-card[^"]*"', text)
    print(f"Process step cards: {len(proc_cards)}")
    
    why_titles = re.findall(r'class="why-card-title">(.*?)</h3>', text)
    print(f"Why titles: {why_titles}")
    
    cta_h2 = re.findall(r'<h2 class="cta-banner-title[^"]*">(.*?)</h2>', text, re.DOTALL)
    print(f"CTA H2: {[h.strip().replace(chr(10), ' ') for h in cta_h2]}")
    
    cta_desc = re.findall(r'<p class="cta-banner-desc[^"]*">(.*?)</p>', text, re.DOTALL)
    print(f"CTA Desc: {[d.strip().replace(chr(10), ' ') for d in cta_desc]}")
    
    cta_btn = re.findall(r'class="cta-primary-btn[^"]*">(.*?)</a>', text, re.DOTALL)
    print(f"CTA Btn: {[b.strip().replace(chr(10), ' ') for b in cta_btn]}")

