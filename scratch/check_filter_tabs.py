with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('portfolio-filter-tabs')
pos2 = text.find('portfolio-grid', pos1)
print(text[pos1-50:pos2+50])

