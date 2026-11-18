with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'Explore Capability' in l or 'service-showcase' in l:
        print(f'{i+1}: {l.strip()[:100]}')

