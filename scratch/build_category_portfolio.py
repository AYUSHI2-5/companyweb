import json
import re

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    all_projects = json.load(f)

# Map projects by slug
proj_map = {p['slug']: p for p in all_projects}

mobile_slugs = ['kp-e-services', 'chick-n-go', 'lpg-booking', 'servizo']
web_slugs = ['ashray-labs', 'vishan-institute-of-technology', 'sunshine-wholesale', 'cyclical-beauty', 'realtybizhub', 'heart-foundation-and-research-institute']
enterprise_slugs = ['procurve', 'just-land', 'just-my-team', 'dodani-erp', 'arizona-land-investors', 'micro-matching']

def build_card(p, cat_tag):
    num = p['num']
    title = p['title']
    slug = p['slug']
    kicker = p['kicker']
    summary = p['summary']
    category = p['category']
    img = p['gallery_images'][0]

    return f"""          <!-- Case Study {num:02d}: {title} -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="{cat_tag}">
            <div class="portfolio-card-media">
              <img src="{img}" alt="{title} - {category}" class="portfolio-card-img" width="580" height="320" loading="lazy">
              <div class="portfolio-case-badge">CASE STUDY {num:02d}</div>
              <div class="portfolio-industry-badge">{category}</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">{kicker}</div>
              <h3 class="portfolio-card-title">{title}</h3>
              <p class="portfolio-card-desc">{summary}</p>

              <div class="portfolio-card-actions">
                <a href="projects/{slug}/" class="btn-portfolio-view" aria-label="View {title} Project Case Study">
                  <span>View Project</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </article>"""

# Build Category 1: Mobile
mobile_cards = "\n\n".join([build_card(proj_map[s], 'mobile') for s in mobile_slugs])
sec_mobile = f"""        <!-- Category Group 1: Mobile & Web Applications -->
        <div class="portfolio-category-section" data-category="mobile">
          <div class="category-section-header">
            <div class="category-header-text">
              <div class="kicker-capsule">
                <span>[ APPLICATION DEVELOPMENT ]</span>
              </div>
              <h2 class="category-heading">Mobile &amp; Web Applications</h2>
              <p class="category-sub">Consumer apps, on-demand service platforms, and field operations systems built for high performance and smooth user flows.</p>
            </div>
            <span class="category-count-badge">4 Projects</span>
          </div>

          <div class="portfolio-grid">
{mobile_cards}
          </div>
        </div>"""

# Build Category 2: Web & E-Commerce
web_cards = "\n\n".join([build_card(proj_map[s], 'web') for s in web_slugs])
sec_web = f"""        <!-- Category Group 2: Web Platforms & Websites -->
        <div class="portfolio-category-section" data-category="web">
          <div class="category-section-header">
            <div class="category-header-text">
              <div class="kicker-capsule">
                <span>[ WEBSITE &amp; E-COMMERCE DEVELOPMENT ]</span>
              </div>
              <h2 class="category-heading">Web Platforms &amp; Websites</h2>
              <p class="category-sub">High-conversion corporate websites, diagnostic patient portals, college management platforms, and B2B wholesale storefronts.</p>
            </div>
            <span class="category-count-badge">6 Projects</span>
          </div>

          <div class="portfolio-grid">
{web_cards}
          </div>
        </div>"""

# Build Category 3: Enterprise Software & ERP
enterprise_cards = "\n\n".join([build_card(proj_map[s], 'enterprise') for s in enterprise_slugs])
sec_enterprise = f"""        <!-- Category Group 3: Enterprise Software, ERP & Marketplaces -->
        <div class="portfolio-category-section" data-category="enterprise">
          <div class="category-section-header">
            <div class="category-header-text">
              <div class="kicker-capsule">
                <span>[ ENTERPRISE SOFTWARE &amp; ERP SYSTEMS ]</span>
              </div>
              <h2 class="category-heading">Enterprise Software, ERP &amp; Marketplaces</h2>
              <p class="category-sub">Sophisticated valuation suites, real estate back-office ERPs, private investor networks, and creator marketing marketplaces.</p>
            </div>
            <span class="category-count-badge">6 Projects</span>
          </div>

          <div class="portfolio-grid">
{enterprise_cards}
          </div>
        </div>"""

filter_bar_html = """        <!-- Interactive Category Filters -->
        <div class="portfolio-filter-bar scroll-reveal" role="tablist" aria-label="Filter portfolio by category">
          <button class="portfolio-filter-btn is-active" data-filter="all" type="button" role="tab" aria-selected="true">All Projects (16)</button>
          <button class="portfolio-filter-btn" data-filter="mobile" type="button" role="tab" aria-selected="false">Mobile Applications (4)</button>
          <button class="portfolio-filter-btn" data-filter="web" type="button" role="tab" aria-selected="false">Web &amp; Websites (6)</button>
          <button class="portfolio-filter-btn" data-filter="enterprise" type="button" role="tab" aria-selected="false">Enterprise Software &amp; ERP (6)</button>
        </div>"""

full_content_block = f"""{filter_bar_html}

{sec_mobile}

{sec_web}

{sec_enterprise}"""

with open('portfolio.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# Replace between <!-- Interactive Category Filters --> and </section>\n\n    <!-- Full-Width Agency CTA Banner -->
start_tag = '<!-- Interactive Category Filters -->'
end_tag = '<!-- Full-Width Agency CTA Banner -->'

start_idx = orig_html.find(start_tag)
end_idx = orig_html.find(end_tag)

if start_idx == -1 or end_idx == -1:
    print("Could not find start or end tag in portfolio.html")
else:
    # We want to replace inside <div class="section-container">
    # The end of the section is </div>\n    </section>\n\n    <!-- Full-Width Agency CTA Banner -->
    sec_end_tag = '</div>\n    </section>\n\n    <!-- Full-Width Agency CTA Banner -->'
    sec_end_idx = orig_html.find(sec_end_tag)
    
    if sec_end_idx != -1:
        new_html = orig_html[:start_idx] + full_content_block + '\n      ' + orig_html[sec_end_idx:]
        with open('portfolio.html', 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("portfolio.html updated category-wise successfully!")
    else:
        print("Could not find sec_end_tag")

