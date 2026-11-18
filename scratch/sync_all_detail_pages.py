import json
import os

with open('data/projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

with open('project-detail.html', 'r', encoding='utf-8') as f:
    base_html = f.read()

# Depth 2 transforms
rel_html = base_html
rel_html = rel_html.replace('href="style.css"', 'href="../../style.css"')
rel_html = rel_html.replace('href="index.html"', 'href="../../index.html"')
rel_html = rel_html.replace('href="services.html"', 'href="../../services.html"')
rel_html = rel_html.replace('href="portfolio.html"', 'href="../../portfolio.html"')
rel_html = rel_html.replace('href="about.html"', 'href="../../about.html"')
rel_html = rel_html.replace('href="contact.html"', 'href="../../contact.html"')
rel_html = rel_html.replace('href="admin.html"', 'href="../../admin.html"')
rel_html = rel_html.replace('src="assets/', 'src="../../assets/')
rel_html = rel_html.replace('src="main.js"', 'src="../../main.js"')
rel_html = rel_html.replace('src="project-database.js"', 'src="../../project-database.js"')

rel_html = rel_html.replace(
    "const project = await ProjectDB.getById(targetSlug);",
    "const project = await ProjectDB.getById(targetSlug, '../../');"
)
rel_html = rel_html.replace(
    "const imagesList = Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png'];",
    "const imagesList = (Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png']).map(img => ProjectDB.resolveAssetPath(img, 2));"
)
rel_html = rel_html.replace(
    "adminLink.href = 'admin.html?edit=' + encodeURIComponent(project.slug);",
    "adminLink.href = '../../admin.html?edit=' + encodeURIComponent(project.slug);"
)

for p in projects:
    slug = p['slug']
    title = p['title']
    category = p['category']

    page_code = rel_html.replace(
        '<script src="../../project-database.js"></script>',
        f'<script>window.BAADAM_CURRENT_SLUG = "{slug}";</script>\n  <script src="../../project-database.js"></script>'
    )
    page_code = page_code.replace(
        '<title>Project Details | BAADAM Studio</title>',
        f'<title>{title} — {category} | BAADAM Studio</title>'
    )
    page_code = page_code.replace(
        '<span id="breadcrumb-current" style="color: var(--brand-red); font-weight: 600;">Loading...</span>',
        f'<span id="breadcrumb-current" style="color: var(--brand-red); font-weight: 600;">{title}</span>'
    )
    page_code = page_code.replace(
        '<span class="badge-category" id="proj-field-category">Category</span>',
        f'<span class="badge-category" id="proj-field-category">{category}</span>'
    )
    page_code = page_code.replace(
        '<h1 class="project-hero-title" id="proj-field-title">\n          Loading Project...\n        </h1>',
        f'<h1 class="project-hero-title" id="proj-field-title">\n          {title}\n        </h1>'
    )
    page_code = page_code.replace(
        'href="../../admin.html" id="admin-edit-link"',
        f'href="../../admin.html?edit={slug}" id="admin-edit-link"'
    )

    out_dir = os.path.join('projects', slug)
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'index.html')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(page_code)
    print(f'Synced {out_file}')

print(f'Successfully updated all {len(projects)} project pages!')
