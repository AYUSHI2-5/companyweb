import json

with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    all_projects = json.load(f)

proj_map = {p['slug']: p for p in all_projects}

# 1. Web & Websites: Any website accessed on a browser
web_slugs = [
    'ashray-labs',
    'vishan-institute-of-technology',
    'sunshine-wholesale',
    'cyclical-beauty',
    'just-land',
    'arizona-land-investors',
    'heart-foundation-and-research-institute',
    'just-my-team',
    'realtybizhub'
]

# 2. Mobile Applications: Dedicated mobile apps
mobile_slugs = [
    'kp-e-services',
    'chick-n-go',
    'lpg-booking',
    'servizo'
]

# 3. Enterprise Software & Internal ERPs: Internal tools and back-office workspaces
enterprise_slugs = [
    'procurve',
    'dodani-erp',
    'micro-matching'
]

def build_card(p, cat_tag):
    num = p['num']
    title = p['title']
    slug = p['slug']
    kicker = p['kicker']
    summary = p['summary']
    category = p['category']
    img = p['gallery_images'][0]

    return f"""          <!-- Project {num:02d}: {title} -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="{cat_tag}">
            <div class="portfolio-card-media">
              <img src="{img}" alt="{title} - {category}" class="portfolio-card-img" width="580" height="320" loading="lazy">
              <div class="portfolio-industry-badge">{category}</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">{kicker}</div>
              <h3 class="portfolio-card-title">{title}</h3>
              <p class="portfolio-card-desc">{summary}</p>

              <div class="portfolio-card-actions">
                <a href="projects/{slug}/" class="btn-portfolio-view" aria-label="View {title} Project">
                  <span>View Project</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </article>"""

# Section 1: Web & Websites (Browser)
web_cards = "\n\n".join([build_card(proj_map[s], 'web') for s in web_slugs])
sec_web = f"""        <!-- Category Group 1: Web & Websites (Browser Websites) -->
        <div class="portfolio-category-section" data-category="web">
          <div class="category-section-header">
            <div class="category-header-text">
              <div class="kicker-capsule">
                <span>[ WEBSITE &amp; BROWSER PLATFORMS ]</span>
              </div>
              <h2 class="category-heading">Web &amp; Websites</h2>
              <p class="category-sub">Public websites, high-conversion commercial portals, property marketplaces, and university platforms accessed directly on desktop and mobile web browsers.</p>
            </div>
            <span class="category-count-badge">9 Projects</span>
          </div>

          <div class="portfolio-grid">
{web_cards}
          </div>
        </div>"""

# Section 2: Mobile Applications
mobile_cards = "\n\n".join([build_card(proj_map[s], 'mobile') for s in mobile_slugs])
sec_mobile = f"""        <!-- Category Group 2: Mobile Applications -->
        <div class="portfolio-category-section" data-category="mobile">
          <div class="category-section-header">
            <div class="category-header-text">
              <div class="kicker-capsule">
                <span>[ MOBILE APPLICATION DEVELOPMENT ]</span>
              </div>
              <h2 class="category-heading">Mobile Applications</h2>
              <p class="category-sub">Native and cross-platform mobile apps for Android and iOS featuring instant booking, digital wallets, on-demand dispatch, and Google Play Store deployment.</p>
            </div>
            <span class="category-count-badge">4 Projects</span>
          </div>

          <div class="portfolio-grid">
{mobile_cards}
          </div>
        </div>"""

# Section 3: Enterprise Software & ERP
enterprise_cards = "\n\n".join([build_card(proj_map[s], 'enterprise') for s in enterprise_slugs])
sec_enterprise = f"""        <!-- Category Group 3: Enterprise Software & ERP -->
        <div class="portfolio-category-section" data-category="enterprise">
          <div class="category-section-header">
            <div class="category-header-text">
              <div class="kicker-capsule">
                <span>[ ENTERPRISE SOFTWARE &amp; INTERNAL ERPS ]</span>
              </div>
              <h2 class="category-heading">Enterprise Software &amp; ERP</h2>
              <p class="category-sub">Specialized internal financial valuation suites, back-office brokerage ERP systems, and automated KYC creator operations panels.</p>
            </div>
            <span class="category-count-badge">3 Projects</span>
          </div>

          <div class="portfolio-grid">
{enterprise_cards}
          </div>
        </div>"""

filter_bar_html = """        <!-- Interactive Category Filters -->
        <div class="portfolio-filter-bar scroll-reveal" role="tablist" aria-label="Filter portfolio by category">
          <button class="portfolio-filter-btn is-active" data-filter="all" type="button" role="tab" aria-selected="true">All Projects (16)</button>
          <button class="portfolio-filter-btn" data-filter="web" type="button" role="tab" aria-selected="false">Web &amp; Websites (9)</button>
          <button class="portfolio-filter-btn" data-filter="mobile" type="button" role="tab" aria-selected="false">Mobile Applications (4)</button>
          <button class="portfolio-filter-btn" data-filter="enterprise" type="button" role="tab" aria-selected="false">Enterprise Software &amp; ERP (3)</button>
        </div>"""

full_content_block = f"""{filter_bar_html}

{sec_web}

{sec_mobile}

{sec_enterprise}"""

with open('portfolio.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

start_tag = '<!-- Interactive Category Filters -->'
sec_end_tag = '</div>\n    </section>\n\n    <!-- Full-Width Agency CTA Banner -->'

start_idx = orig_html.find(start_tag)
sec_end_idx = orig_html.find(sec_end_tag)

if start_idx == -1 or sec_end_idx == -1:
    print("Could not find delimiters in portfolio.html")
else:
    new_html = orig_html[:start_idx] + full_content_block + '\n      ' + orig_html[sec_end_idx:]
    with open('portfolio.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("portfolio.html categorized cleanly: 9 Web & Websites, 4 Mobile Apps, 3 Enterprise Software!")

