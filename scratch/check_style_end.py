with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines in style.css: {len(lines)}')
for i in range(len(lines) - 40, len(lines)):
    print(f'{i+1}: {lines[i].rstrip()}')

