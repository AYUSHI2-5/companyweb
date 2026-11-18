with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'services-sticky-track' in l:
        print(f"Around line {i+1}:")
        for j in range(max(0, i-10), min(len(lines), i+30)):
            print(f"{j+1}: {lines[j]}", end="")
        break

