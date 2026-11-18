with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('/* Stepper Bottom Navigation Bar')
print(text[pos:pos+1500])

