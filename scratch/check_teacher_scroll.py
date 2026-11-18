with open('main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'teacherGuide' in l or 'teacherAvatar' in l or 'initTeacher' in l:
        for j in range(max(0, i-5), min(len(lines), i+30)):
            print(f'{j+1}: {lines[j]}', end='')
        print('---')

