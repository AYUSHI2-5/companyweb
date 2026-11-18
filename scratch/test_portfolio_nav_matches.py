import glob
import re

root_files = glob.glob('*.html')
proj_files = glob.glob('projects/*/index.html')

for f in root_files + proj_files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    m = re.search(r'<li[^>]*nav-item[^>]*>\s*<a href="[^"]*portfolio\.html"[^>]*>[\s\S]*?</a>\s*</li>', c)
    if m:
        print(f'{f}: MATCH -> {m.group(0).strip()}')
    else:
        print(f'{f}: NO MATCH')
