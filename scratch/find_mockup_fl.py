with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.mockup-fl')
print(text[pos:pos+1500])

