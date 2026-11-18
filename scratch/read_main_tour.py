with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('initAutoScrollTour')
pos2 = text.find('// Teacher click handler', pos1)
print(text[pos1:pos2])

