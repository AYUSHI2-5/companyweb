import json
import re

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    raw_projects = json.load(f)

projects = []
for p in raw_projects:
    slug = p.get('slug', '')
    title = p.get('title', '')
    url = p.get('url', '')
    category = p.get('category', 'Software Engineering')
    
    # At home page: Yes or No boolean / indicator
    raw_home = p.get('at_home_page', '')
    at_home_page = True if ('Featured' in str(raw_home) or 'Yes' in str(raw_home)) else False
    
    service_month = p.get('service_month', 'October 2024')
    
    # Duration in days (integer number)
    raw_dur = p.get('service_duration_days', '90 Days')
    dur_match = re.search(r'\d+', str(raw_dur))
    duration_days = int(dur_match.group(0)) if dur_match else 60
    
    technologies = p.get('technologies', [])
    if isinstance(technologies, str):
        technologies = [t.strip() for t in technologies.split(',') if t.strip()]
        
    description = p.get('summary', '') or p.get('description', '')
    
    images = p.get('gallery_images', [])
    if not images:
        images = ['assets/portfolio-hero-1.png', 'assets/portfolio-hero-showcase.png']
        
    project_obj = {
        "id": slug,
        "slug": slug,
        "title": title,
        "url": url,
        "category": category,
        "at_home_page": at_home_page,
        "service_month": service_month,
        "service_duration_days": duration_days,
        "technologies": technologies,
        "description": description,
        "images": images
    }
    projects.append(project_obj)

with open('data/projects.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

print(f"Successfully generated data/projects.json with {len(projects)} projects!")
for p in projects[:3]:
    print(f"- {p['title']}: at_home={p['at_home_page']}, month={p['service_month']}, days={p['service_duration_days']}, tech_count={len(p['technologies'])}, imgs={len(p['images'])}")

