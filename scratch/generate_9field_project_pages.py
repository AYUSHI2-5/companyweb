import json
import os
import re

with open('data/projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Read the clean standalone template from project-detail.html
with open('project-detail.html', 'r', encoding='utf-8') as f:
    base_template = f.read()

# Convert base_template to work inside projects/<slug>/index.html
# 1. Update relative links: index.html -> ../../index.html, etc.
sub_template = base_template
sub_template = sub_template.replace('href="index.html"', 'href="../../index.html"')
sub_template = sub_template.replace('href="services.html"', 'href="../../services.html"')
sub_template = sub_template.replace('href="portfolio.html"', 'href="../../portfolio.html"')
sub_template = sub_template.replace('href="about.html"', 'href="../../about.html"')
sub_template = sub_template.replace('href="contact.html"', 'href="../../contact.html"')
sub_template = sub_template.replace('href="admin.html"', 'href="../../admin.html"')
sub_template = sub_template.replace('href="style.css"', 'href="../../style.css"')
sub_template = sub_template.replace('src="assets/', 'src="../../assets/')
sub_template = sub_template.replace('src="project-database.js"', 'src="../../project-database.js"')

# In the script, pass relative level 2 to getById
sub_template = sub_template.replace(
    "let targetSlug = urlParams.get('slug') || urlParams.get('id');",
    "let targetSlug = window.BAADAM_CURRENT_SLUG || urlParams.get('slug') || urlParams.get('id');"
)
sub_template = sub_template.replace(
    "const project = await ProjectDB.getById(targetSlug);",
    "const project = await ProjectDB.getById(targetSlug, '../../');"
)
sub_template = sub_template.replace(
    "const imagesList = Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png'];",
    "const imagesList = (Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png']).map(img => ProjectDB.resolveAssetPath(img, 2));"
)

for p in projects:
    slug = p['slug']
    title = p['title']
    category = p['category']
    url = p['url']
    at_home = p['at_home_page']
    month = p['service_month']
    duration = p['service_duration_days']
    desc = p['description']
    images = p['images']

    # Set slug definition before script execution
    customized_html = sub_template.replace(
      '<script src="../../project-database.js"></script>',
      f'<script>window.BAADAM_CURRENT_SLUG = "{slug}";</script>\n  <script src="../../project-database.js"></script>'
    )
    
    # Pre-populate title tag for immediate rendering before JS executes
    customized_html = customized_html.replace(
      '<title>Project Details | BAADAM Studio</title>',
      f'<title>{title} — {category} | BAADAM Studio</title>'
    )
    customized_html = customized_html.replace(
      'Loading Project...',
      title
    )
    customized_html = customized_html.replace(
      '<span id="breadcrumb-current" style="color: var(--brand-red);">Loading...</span>',
      f'<span id="breadcrumb-current" style="color: var(--brand-red);">{title}</span>'
    )
    customized_html = customized_html.replace(
      '<span class="badge-category" id="proj-field-category">Category</span>',
      f'<span class="badge-category" id="proj-field-category">{category}</span>'
    )
    
    out_dir = os.path.join('projects', slug)
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'index.html')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(customized_html)
    print(f"Generated {out_file}")

print(f"Successfully generated all {len(projects)} project detail pages!")
