with open('services-accordion.js', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
print("\n".join(lines[200:314]))

