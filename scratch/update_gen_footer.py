import os, re

with open('scratch/sync_canonical_footer.py', 'r', encoding='utf-8') as f:
    sync_code = f.read()

canon_project = re.search(r'canonical_project_footer = """([\s\S]*?)"""', sync_code).group(1)

for fname in ['scratch/generate_refined_cms_pages.py', 'scratch/generate_full_cms_pages.py']:
    if os.path.exists(fname):
        with open(fname, 'r', encoding='utf-8') as f:
            code = f.read()
        code = re.sub(r'<footer class="site-footer"[\s\S]*?</footer>', canon_project.strip(), code)
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f'Updated {fname}')
