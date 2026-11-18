import re

files = [
    'services/website-development/index.html',
    'services/application-development/index.html',
    'services/digital-marketing/index.html'
]

tags = ['div', 'section', 'article', 'header', 'footer', 'aside', 'nav', 'ul', 'li', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'span', 'strong', 'button']

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print(f"\nChecking tag balance for: {path}")
    has_imbalance = False
    for tag in tags:
        # Match opening tags, excluding self-closing or comments
        opened = len(re.findall(rf'<{tag}(\s+[^>]*?)?>', html, re.IGNORECASE))
        closed = len(re.findall(rf'</{tag}>', html, re.IGNORECASE))
        if opened != closed:
            print(f"  [MISMATCH] <{tag}>: opened {opened}, closed {closed}")
            has_imbalance = True
    if not has_imbalance:
        print(f"  [OK] All checked tags perfectly balanced in {path}!")

