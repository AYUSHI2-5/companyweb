for s in ['services/application-development/index.html', 'services/digital-marketing/index.html']:
    with open(s, 'r', encoding='utf-8') as f:
        text = f.read()
    has_text_wrap = 'class="cta-banner-text"' in text
    has_visual = 'class="cta-banner-visual"' in text
    print(f"{s}: has text wrap: {has_text_wrap}, has visual: {has_visual}")

