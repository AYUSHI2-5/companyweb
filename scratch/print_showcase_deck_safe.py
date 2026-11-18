with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(920, 980):
    if j < len(lines):
        print(f'{j+1}: {lines[j].encode("ascii", "replace").decode("ascii").rstrip()}')

