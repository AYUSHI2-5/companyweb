with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
articles = re.findall(r'<article[^>]*>', text)
print("Found article tags:")
for a in articles[:5]:
    print(a)

pos = text.find('KP E-Services')
print("\nAround KP E-Services:")
print(text[pos-150:pos+400])

