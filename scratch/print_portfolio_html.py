with open('portfolio.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines in portfolio.html: {len(lines)}')
for i in range(50, 180):
    if i < len(lines):
        print(f'{i+1}: {lines[i].rstrip()}')

