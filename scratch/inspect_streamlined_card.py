with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('<!-- Case Study 01: KP E-Services -->')
pos2 = text.find('<!-- Case Study 02: Ashray Labs -->')
print(text[pos1:pos2])

