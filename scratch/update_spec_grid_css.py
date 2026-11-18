with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('.project-cms-spec-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);', '.project-cms-spec-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);')
css = css.replace('.project-cms-spec-grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(4, 1fr);', '.project-cms-spec-grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(3, 1fr);')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated style.css successfully')

