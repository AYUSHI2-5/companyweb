with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.portfolio-card-desc')
print(text[pos-100:pos+250])

