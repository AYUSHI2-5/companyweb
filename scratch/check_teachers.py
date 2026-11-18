import re
for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    c = open(f, encoding='utf-8').read()
    matches = re.findall(r'assets/teacher[^"\'\s>]*', c)
    print(f, set(matches))

