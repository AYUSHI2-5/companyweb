with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(770, 835):
    print(f'{i+1}: {lines[i]}', end='')

