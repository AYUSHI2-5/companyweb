with open('contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace body tag and link
content = content.replace('<link rel="stylesheet" href="style.css?v=28">', '<link rel="stylesheet" href="style.css?v=33">')
content = content.replace('<body>', '<body class="contact-page">')

# Remove teacher-guide-widget
t_start = '<!-- Teacher Avatar Guide (Bottom-Left) -->'
t_end = '</aside>'
p1 = content.find(t_start)
if p1 != -1:
    p2 = content.find(t_end, p1)
    if p2 != -1:
        content = content[:p1] + content[p2+len(t_end):]
        print('Teacher guide widget removed from contact.html')

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('contact.html updated successfully!')

