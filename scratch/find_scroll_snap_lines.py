with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.splitlines(), 1):
    if 'scroll-snap' in line:
        print(f"Line {i}: {line}")

