with open('services-accordion.js', 'r', encoding='utf-8') as f:
    text = f.read()

print(f"Length of services-accordion.js: {len(text)} chars, {len(text.splitlines())} lines")
print(text[:2000])

