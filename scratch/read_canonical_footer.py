with open('services/website-development/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('<footer class="site-footer"')
pos2 = text.find('</footer>', pos1)
print(text[pos1:pos2+9])

