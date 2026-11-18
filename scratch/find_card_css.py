with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '.portfolio-card {' in l:
        print(f'Starting at line {i+1}')
        for j in range(max(0, i-5), min(len(lines), i + 40)):
            print(f'{j+1}: {lines[j].rstrip()}')
        break

