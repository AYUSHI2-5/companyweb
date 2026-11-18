import html

from define_projects import projects

card_html_list = []

for p in projects:
    tags_html = "\n".join([f'                  <span class="portfolio-tag">{html.escape(t)}</span>' for t in p["tags"]])
    card_str = f'''          <!-- Case Study {p["id"]}: {html.escape(p["name"])} -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="{p["category"]}">
            <div class="portfolio-card-media">
              <img src="{p["image"]}" alt="{html.escape(p["name"])} - {html.escape(p["industry"])}" class="portfolio-card-img" width="580" height="320" loading="lazy">
              <div class="portfolio-case-badge">CASE STUDY {p["id"]}</div>
              <div class="portfolio-industry-badge">{html.escape(p["industry"])}</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">{html.escape(p["kicker"])}</div>
              <h2 class="portfolio-card-title">{html.escape(p["name"])}</h2>

              <div class="portfolio-meta-row">
                <span class="meta-label">Services:</span>
                <span class="meta-value">{html.escape(p["services"])}</span>
              </div>

              <div class="portfolio-case-details">
                <div class="case-detail-box challenge-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#9679;</span>
                    <span class="detail-box-label">Challenge</span>
                  </div>
                  <p class="detail-box-text">{html.escape(p["challenge"])}</p>
                </div>

                <div class="case-detail-box solution-box">
                  <div class="detail-box-header">
                    <span class="detail-box-icon" aria-hidden="true">&#10003;</span>
                    <span class="detail-box-label">Solution</span>
                  </div>
                  <p class="detail-box-text">{html.escape(p["solution"])}</p>
                </div>
              </div>

              <div class="portfolio-outcome-banner">
                <span class="outcome-label">Outcome:</span>
                <span class="outcome-text">{html.escape(p["outcome"])}</span>
              </div>

              <div class="portfolio-tech-footer">
                <span class="tech-stack-label">Technology:</span>
                <div class="portfolio-card-tags">
{tags_html}
                </div>
              </div>
            </div>
          </article>'''
    card_html_list.append(card_str)

full_grid_content = "\n\n".join(card_html_list)

with open('portfolio.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

import re

# Find the portfolio-grid and replace its contents
pattern = r'(<div class="portfolio-grid">).*?(</div>\s*</div>\s*</section>)'
match = re.search(pattern, orig_html, re.DOTALL)
assert match is not None, "portfolio-grid not found in portfolio.html"

new_grid = f'''<div class="portfolio-grid">\n{full_grid_content}\n        </div>'''
new_html = orig_html[:match.start(1)] + new_grid + orig_html[match.end(1) + (match.end(0) - match.start(2)) - len(match.group(2)): ]
# Let's verify cleanly by replacing match.group(0)
replacement_full = f'''<div class="portfolio-grid">\n{full_grid_content}\n        </div>\n      </div>\n    </section>'''
new_html = orig_html[:match.start(0)] + replacement_full + orig_html[match.end(0):]

# Update filter bar badge
new_html = new_html.replace(
    '<button class="portfolio-filter-btn is-active" data-filter="all" type="button" role="tab" aria-selected="true">All Case Studies</button>',
    '<button class="portfolio-filter-btn is-active" data-filter="all" type="button" role="tab" aria-selected="true">All Case Studies (16)</button>'
)

# Bump version in portfolio.html
new_html = new_html.replace('style.css?v=27', 'style.css?v=28')
new_html = new_html.replace('main.js?v=27', 'main.js?v=28')

with open('portfolio.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_html)

print("Successfully updated portfolio.html with all 16 projects!")

