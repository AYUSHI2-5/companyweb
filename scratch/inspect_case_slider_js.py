with open('case-study-slider.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of case-study-slider.js:', len(text))
for line in text.split('\n')[:80]:
    print(line)

