import re

with open('projects/kp-e-services/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = re.findall(r'<script.*?</script>', text, re.DOTALL | re.IGNORECASE)
print('Total <script> tags in kp-e-services/index.html:', len(scripts))
for s in scripts:
    print(s[:200])

