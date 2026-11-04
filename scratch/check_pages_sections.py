import re

for filename in ['about.html', 'services.html', 'portfolio.html', 'contact.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f"\n=== {filename} ===")
    matches = re.findall(r'<(?:section|header|footer)[^>]*class=[\'"]([^\'"]*)[\'"][^>]*id=[\'"]([^\'"]*)[\'"]|class=[\'"]([^\'"]*)[\'"]', text)
    tags = re.findall(r'<(section|footer|header)\s+([^>]+)>', text)
    for tag, attrs in tags:
        print(f"<{tag} {attrs}>")

