with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('12. Interactive Services Accordion')
pos2 = text.find('13.', pos1)
print(text[pos1:pos2])

