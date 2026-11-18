with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.footer-bottom')
print(text[pos:pos+1000])

