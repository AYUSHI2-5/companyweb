with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.deliverables-item')
print(text[pos:pos+1500])

