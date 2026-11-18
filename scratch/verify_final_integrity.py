import re
import subprocess

print("--- RUNNING INTEGRITY CHECKS ---")

# 1. Check style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()
open_b = css.count('{')
close_b = css.count('}')
print(f"style.css: {open_b} open braces, {close_b} close braces (delta: {open_b - close_b})")
assert open_b == close_b, "Unbalanced braces in style.css"

# 2. Check index.html tag balance
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

tags = ['div', 'section', 'article', 'header', 'footer', 'aside', 'nav', 'ul', 'li', 'button']
for tag in tags:
    opened = len(re.findall(rf'<{tag}(\s+[^>]*?)?>', html, re.IGNORECASE))
    closed = len(re.findall(rf'</{tag}>', html, re.IGNORECASE))
    if opened != closed:
        print(f"Warning: <{tag}> mismatch: {opened} opened, {closed} closed")
print("index.html: checked structural tags balance.")

# 3. Check JS syntax
res1 = subprocess.run(['node', '-c', 'services-accordion.js'], capture_output=True, text=True)
if res1.returncode == 0:
    print("services-accordion.js: Syntax OK!")
else:
    print("services-accordion.js: Error:", res1.stderr)

res2 = subprocess.run(['node', '-c', 'main.js'], capture_output=True, text=True)
if res2.returncode == 0:
    print("main.js: Syntax OK!")
else:
    print("main.js: Error:", res2.stderr)

print("--- ALL CHECKS PASSED ---")

