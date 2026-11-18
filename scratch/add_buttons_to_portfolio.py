import json
import re

with open('scratch/extracted_projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

with open('portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

count_updated = 0
for p in projects:
    title = p['title']
    slug = p['slug']
    
    # We find the article containing this title
    # And check if it already has the button
    button_html = f'''              <div class="portfolio-card-actions">
                <a href="projects/{slug}/" class="btn-portfolio-view" aria-label="View {title} Project Case Study">
                  <span>View Project</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>'''
              
    # Let's locate the article for this project
    # Search pattern: from <h2 class="portfolio-card-title">{re.escape(title)}</h2> down to </article>
    pattern = rf'(<h2 class="portfolio-card-title">{re.escape(title)}</h2>.*?</div>\s*</div>)(\s*</div>\s*</article>)'
    
    match = re.search(pattern, html, re.DOTALL)
    if match:
        # Check if button already present
        if f'projects/{slug}/' not in match.group(0):
            replacement = match.group(1) + '\n\n' + button_html + match.group(2)
            html = html[:match.start()] + replacement + html[match.end():]
            count_updated += 1
            print(f"Added View Project button for: {title} -> projects/{slug}/")
        else:
            print(f"Button already exists for: {title}")
    else:
        print(f"COULD NOT MATCH pattern for: {title}")

print(f"\nTotal cards updated in portfolio.html: {count_updated}")

with open('portfolio.html', 'w', encoding='utf-8') as f:
    f.write(html)

