with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '12. Interactive Services Accordion' in l:
        print(f"Section 12 starts at line {i+1}")
        for j in range(i, min(len(lines), i+120)):
            print(f"{j+1}: {lines[j]}", end="")
        break

