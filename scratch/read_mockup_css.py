with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('/* Left Column: Interactive Browser UI Mockup */')
pos2 = text.find('/* Stepper Bottom Navigation Bar', pos1)
print(text[pos1:pos1+2500])

