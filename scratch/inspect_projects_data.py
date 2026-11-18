import json

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

for p in projects:
    print(f"{p['num']:02d} | {p['slug']} | {p['category']} | {len(p['features'])} feats | {len(p['technologies'])} techs | URL: {p['url']}")

