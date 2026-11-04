import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Find all rules with 100vh
vh_rules = re.findall(r'([^{]+)\{[^}]*100vh[^}]*\}', css)
print("CSS rules with 100vh:")
for r in vh_rules:
    selector = r.strip().replace('\n', ' ')
    if not any(k in selector for k in ['@keyframes', 'teacher', 'mobile-nav', 'trans']):
        print(" -", selector)

