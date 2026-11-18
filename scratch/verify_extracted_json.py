import json

with open('scratch/extracted_projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

print(f"Extracted projects count: {len(projects)}")
for p in projects:
    print(f" - #{p['num']}: {p['title']} ({p['slug']}) | Category: {p['category']}")

