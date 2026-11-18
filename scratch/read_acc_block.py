with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('/* Accordion Item Base */')
pos2 = text.find('/* Left Column: Interactive Browser UI Mockup */')
print(text[pos1:pos2])

