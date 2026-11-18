import glob
import re

for pf in glob.glob('projects/*/index.html'):
    with open(pf, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # check that CTA banner has matched tags
    cta = re.search(r'<!-- Final CTA Banner -->[\s\S]*?</section>', html)
    if not cta:
        print(f'Missing CTA in {pf}')
        continue
    c = cta.group(0)
    opens = len(re.findall(r'<div\b', c))
    closes = len(re.findall(r'</div>', c))
    if opens != closes:
        print(f'Div mismatch in {pf}: {opens} opens, {closes} closes')
print('Tag check complete!')
