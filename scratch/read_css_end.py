with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
print(f"Total lines in style.css: {len(lines)}")
print("\n".join(lines[-30:]))

