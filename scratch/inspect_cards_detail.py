import re

with open('portfolio.html', 'r', encoding='utf-8') as f:
    p_text = f.read()

# Let's inspect one full article.portfolio-card in portfolio.html
card_match = re.search(r'<article class="portfolio-card.*?</article>', p_text, re.DOTALL)
if card_match:
    print('Sample card in portfolio.html:\n', card_match.group(0)[:1000])

with open('index.html', 'r', encoding='utf-8') as f:
    idx_text = f.read()

# Look for portfolio or case study sections in index.html
sections = re.findall(r'<section[^>]*id=["\'][^"\']*(?:portfolio|case|project)[^"\']*["\'][^>]*>', idx_text, re.IGNORECASE)
print('\nSections in index.html related to portfolio/case:')
for s in sections:
    print(' ', s)

# Let's see what is inside case-studies-section in index.html
cs_match = re.search(r'<section[^>]*id=["\']case-studies-section["\'].*?</section>', idx_text, re.DOTALL)
if cs_match:
    print('\nFound case-studies-section in index.html, length:', len(cs_match.group(0)))
    articles = re.findall(r'<article[^>]*>.*?</article>', cs_match.group(0), re.DOTALL)
    print(f'Count of articles inside case-studies-section: {len(articles)}')
    if articles:
        print('Sample article in case-studies-section:\n', articles[0][:800])

