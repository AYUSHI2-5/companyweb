import json

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Map slugs to related projects (3 related projects each)
def get_related_projects(current_slug, all_projects):
    # Mapping table for tight relevance
    related_map = {
        'kp-e-services': ['chick-n-go', 'lpg-booking', 'servizo'],
        'ashray-labs': ['heart-foundation-and-research-institute', 'vishan-institute-of-technology', 'sunshine-wholesale'],
        'procurve': ['dodani-erp', 'micro-matching', 'kp-e-services'],
        'heart-foundation-and-research-institute': ['ashray-labs', 'vishan-institute-of-technology', 'arizona-land-investors'],
        'vishan-institute-of-technology': ['heart-foundation-and-research-institute', 'realtybizhub', 'ashray-labs'],
        'chick-n-go': ['kp-e-services', 'lpg-booking', 'sunshine-wholesale'],
        'sunshine-wholesale': ['cyclical-beauty', 'chick-n-go', 'just-land'],
        'cyclical-beauty': ['sunshine-wholesale', 'chick-n-go', 'realtybizhub'],
        'lpg-booking': ['kp-e-services', 'servizo', 'dodani-erp'],
        'servizo': ['lpg-booking', 'chick-n-go', 'just-land'],
        'just-land': ['just-my-team', 'arizona-land-investors', 'dodani-erp'],
        'just-my-team': ['just-land', 'realtybizhub', 'dodani-erp'],
        'realtybizhub': ['just-land', 'just-my-team', 'micro-matching'],
        'dodani-erp': ['procurve', 'just-land', 'arizona-land-investors'],
        'arizona-land-investors': ['just-land', 'procurve', 'dodani-erp'],
        'micro-matching': ['procurve', 'realtybizhub', 'kp-e-services']
    }
    
    slugs = related_map.get(current_slug, [])
    if len(slugs) < 3:
        # Fallback to other projects
        for other in all_projects:
            if other['slug'] != current_slug and other['slug'] not in slugs:
                slugs.append(other['slug'])
            if len(slugs) == 3:
                break
                
    # Return project objects
    slug_to_p = {p['slug']: p for p in all_projects}
    return [slug_to_p[s] for s in slugs if s in slug_to_p]

print("Related projects logic tested!")
for p in projects[:3]:
    rel = get_related_projects(p['slug'], projects)
    print(p['title'], '->', [r['title'] for r in rel])

