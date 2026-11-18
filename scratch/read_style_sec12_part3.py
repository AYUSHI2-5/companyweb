with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(1870, min(len(lines), 1950)):
    print(f"{j+1}: {lines[j]}", end="")

