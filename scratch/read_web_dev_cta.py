with open('services/website-development/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('cta-banner-card')
pos2 = text.find('</section>', pos1)
print("In services/website-development/index.html:")
print(text[pos1-50:pos2+12])

