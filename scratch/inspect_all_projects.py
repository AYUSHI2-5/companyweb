import json

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

print(f'Total projects: {len(projects)}')
for p in projects:
    print(f"[{p.get('num')}] {p.get('title')} ({p.get('slug')})")
    print(f"  Category: {p.get('category')}")
    print(f"  URL: {p.get('url')}")
    print(f"  At Home Page: {p.get('at_home_page')}")
    print(f"  Service Month: {p.get('service_month')}")
    print(f"  Duration: {p.get('service_duration_days')}")
    print(f"  Tech count: {len(p.get('technologies', []))}")
    print(f"  Images count: {len(p.get('gallery_images', []))}")
    print(f"  Summary len: {len(p.get('summary', ''))}")

