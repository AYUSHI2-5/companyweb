import os
import re

pfile = 'projects/kp-e-services/index.html'
with open(pfile, 'r', encoding='utf-8') as f:
    text = f.read()

footer = re.search(r'<footer[^>]*>.*?</footer>', text, re.DOTALL).group(0)
imgs = re.findall(r'<img[^>]*>', footer)
for img in imgs:
    src = re.search(r'src="([^"]*)"', img).group(1)
    full_path = os.path.normpath(os.path.join(os.path.dirname(pfile), src))
    print(f"Img: {img} -> resolved path: {full_path} exists? {os.path.exists(full_path)}")

