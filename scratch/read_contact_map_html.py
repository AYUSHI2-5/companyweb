with open('contact.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(385, 445):
    print(f'{i+1}: {lines[i]}', end='')

