with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(4370, 4440):
    print(f'{i+1}: {lines[i]}', end='')

