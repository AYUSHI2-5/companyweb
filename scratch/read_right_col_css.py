with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('/* Right Column: Editorial & Conversion Offer */')
pos2 = text.find('/* Case Studies Section', pos1)
print(text[pos1:pos1+2500])

