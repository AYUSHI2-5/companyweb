with open('main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(540, 585):
    print(f'{i+1}: {lines[i]}', end='')

