with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('cta-banner-card')
pos2 = text.find('</section>', pos1)
print("In about.html:")
print(text[pos1-50:pos2+12])

