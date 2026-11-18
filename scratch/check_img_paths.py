import re
import os

with open('projects/kp-e-services/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', text)
print("Found images in kp-e-services/index.html:")
for img in imgs:
    # Resolve relative to projects/kp-e-services
    resolved = os.path.normpath(os.path.join('projects', 'kp-e-services', img))
    exists = os.path.exists(resolved)
    print(f"{img} -> exists on disk: {exists} ({resolved})")

