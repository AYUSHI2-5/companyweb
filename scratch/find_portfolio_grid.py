with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('portfolio-grid')
print(text[pos-400:pos+300])

