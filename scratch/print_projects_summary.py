import json

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for p in data:
    print(f"=== {p['num']}: {p['title']} ({p['slug']}) ===")
    print("Category:", p['category'])
    print("Kicker:", p['kicker'])
    print("Techs:", p['technologies'])
    print("Features:", [f[0] for f in p['features']])
    print("Outcomes:", p['outcomes'])
    print()

