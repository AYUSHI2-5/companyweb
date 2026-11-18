with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'portfolio-showcase-section' in l:
        print(f"Around line {i+1}:")
        for j in range(max(0, i-15), min(len(lines), i+10)):
            print(f"{j+1}: {lines[j]}", end="")
        break

