with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('Portfolio Case Study Card Meta & Details Enhancement')
print(text[pos:pos+800])

