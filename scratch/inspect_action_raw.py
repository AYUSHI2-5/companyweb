with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'service-card-action' in l:
        print(f'Around line {i+1}:')
        for j in range(max(0, i-4), min(len(lines), i + 6)):
            print(f'  {j+1}: {repr(lines[j])}')
        break

