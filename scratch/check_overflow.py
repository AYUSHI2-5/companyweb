with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line for k in ['html {', 'body {', 'body.', 'html,', '.site-main']):
        for j in range(i, min(len(lines), i + 20)):
            if 'overflow' in lines[j]:
                print(f'{i+1} -> {j+1}: {line.strip()} | {lines[j].strip()}')
            if '}' in lines[j]:
                break

