with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('.services-accordion-stack')
pos2 = text.find('/* Responsive Overrides', pos1)
print(text[pos1:pos1+1500])

