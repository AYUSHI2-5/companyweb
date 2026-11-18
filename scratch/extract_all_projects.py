import re
import json

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

articles = re.findall(r'<article class="portfolio-card[^"]*".*?</article>', text, re.DOTALL)
print(f"Total articles found: {len(articles)}")

projects = []
for i, art in enumerate(articles, 1):
    case_num_m = re.search(r'class="portfolio-case-badge">([^<]*)<', art)
    industry_m = re.search(r'class="portfolio-industry-badge">([^<]*)<', art)
    kicker_m = re.search(r'class="portfolio-card-kicker">([^<]*)<', art)
    title_m = re.search(r'class="portfolio-card-title">([^<]*)<', art)
    img_m = re.search(r'class="portfolio-card-img"[^>]*src="([^"]*)"', art)
    if not img_m:
        img_m = re.search(r'src="([^"]*)"[^>]*class="portfolio-card-img"', art)
    
    services_m = re.search(r'<span class="meta-label">Services:</span>\s*<span class="meta-value">([^<]*)<', art)
    challenge_m = re.search(r'class="detail-box-label">Challenge</span>\s*</div>\s*<p class="detail-box-text">([^<]*)<', art)
    solution_m = re.search(r'class="detail-box-label">Solution</span>\s*</div>\s*<p class="detail-box-text">([^<]*)<', art)
    outcome_m = re.search(r'class="outcome-label">Outcome:</span>\s*<span class="outcome-text">([^<]*)<', art)
    
    tags = re.findall(r'class="portfolio-tag">([^<]*)<', art)
    category_m = re.search(r'data-category="([^"]*)"', art)

    pdata = {
        'num': i,
        'case_badge': case_num_m.group(1).strip() if case_num_m else f"CASE STUDY {i:02d}",
        'industry': industry_m.group(1).strip() if industry_m else "",
        'kicker': kicker_m.group(1).strip() if kicker_m else "",
        'title': title_m.group(1).strip() if title_m else "",
        'img': img_m.group(1).strip() if img_m else "",
        'services': services_m.group(1).strip() if services_m else "",
        'challenge': challenge_m.group(1).strip() if challenge_m else "",
        'solution': solution_m.group(1).strip() if solution_m else "",
        'outcome': outcome_m.group(1).strip() if outcome_m else "",
        'tags': tags,
        'category': category_m.group(1).strip() if category_m else ""
    }
    
    # Generate clean slug
    clean_title = pdata['title'].lower()
    clean_title = re.sub(r'[^a-z0-9]+', '-', clean_title).strip('-')
    pdata['slug'] = clean_title
    
    projects.append(pdata)

print("\nExtracted projects:")
for p in projects:
    print(f"#{p['num']}: {p['title']} -> slug: {p['slug']} | img: {p['img']} | industry: {p['industry']}")

with open('scratch/extracted_projects.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, indent=2)

