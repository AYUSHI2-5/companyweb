with open('scratch/generate_refined_cms_pages.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('  </footer>\n</body>', '  </footer>\n\n  <!-- Main Script -->\n  <script src="../../main.js" defer></script>\n</body>')
text = text.replace('  </footer>\r\n</body>', '  </footer>\r\n\r\n  <!-- Main Script -->\r\n  <script src="../../main.js" defer></script>\r\n</body>')

with open('scratch/generate_refined_cms_pages.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Added main.js script to generator successfully')

