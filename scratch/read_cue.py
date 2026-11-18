with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("performTeacherScrollCue")
print(text[pos-50:pos+800])

