import glob
import re

def get_mega_menu_html(rel_prefix, is_active):
    active_cls = " active" if is_active else ""
    return f"""          <li class="nav-item nav-item-has-dropdown" id="nav-portfolio-item">
            <a href="{rel_prefix}portfolio.html" class="nav-link nav-link-dropdown-trigger{active_cls}" id="nav-portfolio-link" aria-haspopup="true" aria-expanded="false" aria-controls="portfolio-mega-menu">
              <span>Portfolio</span>
              <svg class="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 1L5 5L9 1"/>
              </svg>
            </a>

            <!-- Portfolio Image-Based Mega Menu Dropdown (Kumbh Design Inspired) -->
            <div class="portfolio-mega-menu" id="portfolio-mega-menu" role="region" aria-label="Portfolio Categories">
              <div class="mega-menu-inner">
                <div class="mega-menu-grid">
                  
                  <!-- Card 1: Creative Design -->
                  <a href="{rel_prefix}portfolio.html?filter=creative" class="mega-menu-card" data-category="creative" aria-label="Creative Design Portfolio">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-creative-design.jpg" alt="Creative Design & Brand Identity Showcase" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Creative Design</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 2: Digital Marketing -->
                  <a href="{rel_prefix}portfolio.html?filter=marketing" class="mega-menu-card" data-category="marketing" aria-label="Digital Marketing Portfolio">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-digital-marketing.jpg" alt="Digital Marketing & Social Campaigns Showcase" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Digital Marketing</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 3: Web Services -->
                  <a href="{rel_prefix}portfolio.html?filter=web" class="mega-menu-card" data-category="web" aria-label="Web Services Portfolio">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-web-services.jpg" alt="Web Services & Custom Web Platforms Showcase" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Web Services</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 4: Mobile Apps -->
                  <a href="{rel_prefix}portfolio.html?filter=mobile" class="mega-menu-card" data-category="mobile" aria-label="Mobile Applications Portfolio">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-mobile-apps.jpg" alt="Mobile Applications & iOS Android Apps Showcase" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Mobile Apps</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                </div>
              </div>
            </div>
          </li>"""

# 1. Update Root Pages
root_files = glob.glob('*.html')
for rf in root_files:
    with open(rf, 'r', encoding='utf-8') as f:
        content = f.read()

    is_portfolio_active = ('portfolio.html' in rf or 'project-detail.html' in rf or 'admin.html' in rf)
    replacement = get_mega_menu_html('', is_portfolio_active)

    # Match existing nav item
    pattern = r'<li[^>]*nav-item[^>]*>\s*<a href="portfolio\.html"[^>]*>[\s\S]*?</a>\s*(?:<div class="portfolio-mega-menu"[\s\S]*?</div>\s*</div>\s*</div>\s*)?</li>'
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        
        # Ensure portfolio-mega-menu.js script is included before </body>
        script_tag = '<script src="portfolio-mega-menu.js" defer></script>'
        if 'portfolio-mega-menu.js' not in content:
            content = content.replace('</body>', f'  {script_tag}\n</body>')

        with open(rf, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated root page: {rf}')
    else:
        print(f'No match in root page: {rf}')

# 2. Update Project Pages
proj_files = glob.glob('projects/*/index.html')
for pf in proj_files:
    with open(pf, 'r', encoding='utf-8') as f:
        content = f.read()

    replacement = get_mega_menu_html('../../', True)

    pattern = r'<li[^>]*nav-item[^>]*>\s*<a href="\.\./\.\./portfolio\.html"[^>]*>[\s\S]*?</a>\s*(?:<div class="portfolio-mega-menu"[\s\S]*?</div>\s*</div>\s*</div>\s*)?</li>'
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        
        # Ensure script is included
        script_tag = '<script src="../../portfolio-mega-menu.js" defer></script>'
        if 'portfolio-mega-menu.js' not in content:
            content = content.replace('</body>', f'  {script_tag}\n</body>')

        with open(pf, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated project page: {pf}')
    else:
        print(f'No match in project page: {pf}')
