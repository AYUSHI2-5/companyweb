with open('main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(630, 680):
    print(f'{i+1}: {lines[i]}', end='')

