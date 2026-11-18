with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("target.id === 'services-section'")
print(text[pos-100:pos+800])

