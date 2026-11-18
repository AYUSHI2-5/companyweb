with open('portfolio.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(175, 275):
    if i < len(lines):
        print(f'{i+1}: {lines[i].rstrip()}')

