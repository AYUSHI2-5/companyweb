with open('contact.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'Find Us in' in l or 'contact-map' in l or 'VISIT OUR STUDIO' in l:
        for j in range(max(0, i-5), min(len(lines), i+35)):
            print(f'{j+1}: {lines[j]}', end='')
        print('---')

