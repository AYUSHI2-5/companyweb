with open('main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'teacherWidget' in l and ('style.opacity' in l or 'classList' in l or 'display' in l):
        print(f'{i+1}: {l.strip()}')

