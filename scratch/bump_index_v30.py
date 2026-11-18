with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('services-accordion.js?v=27', 'services-accordion.js?v=30')
text = text.replace('style.css?v=28', 'style.css?v=30')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Bumped version to v=30 in index.html!")

