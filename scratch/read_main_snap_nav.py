with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('initSectionSnapNav')
pos2 = text.find('initAutoScrollTour', pos1)
print(text[pos1:pos2])

