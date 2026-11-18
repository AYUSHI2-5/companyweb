with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('/* ==========================================================================')
# Find site-footer section
pos_footer = text.find('Site Footer', pos1)
print(text[pos_footer-50:pos_footer+1200])

