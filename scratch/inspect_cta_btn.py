with open('services/website-development/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("cta-banner-btn-wrap")
print(text[pos:pos+300])

