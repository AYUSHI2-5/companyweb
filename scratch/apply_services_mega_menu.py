import glob
import re

def get_services_mega_menu_html(rel_prefix, is_active):
    active_cls = " active" if is_active else ""
    return f"""          <li class="nav-item nav-item-has-dropdown" id="nav-services-item">
            <a href="{rel_prefix}services.html" class="nav-link nav-link-dropdown-trigger{active_cls}" id="nav-services-link" aria-haspopup="true" aria-expanded="false" aria-controls="services-mega-menu">
              <span>Services</span>
              <svg class="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 1L5 5L9 1"/>
              </svg>
            </a>

            <!-- Services Image-Based Mega Menu Dropdown (Kumbh Design Pattern) -->
            <div class="services-mega-menu portfolio-mega-menu" id="services-mega-menu" role="region" aria-label="Services Showcase">
              <div class="mega-menu-inner">
                <div class="mega-menu-grid">
                  
                  <!-- Card 1: Website Development -->
                  <a href="{rel_prefix}services/website-development/" class="mega-menu-card" data-service="web-dev" aria-label="Website Development Capability">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-service-web.jpg" alt="Website Development & High-Performing Web Platforms" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Website Development</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 2: Application Development -->
                  <a href="{rel_prefix}services/application-development/" class="mega-menu-card" data-service="app-dev" aria-label="Application Development Capability">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-service-app.jpg" alt="Application Development - Mobile & Modern Web Apps" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Application Development</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 3: Software Development -->
                  <a href="{rel_prefix}services.html#software-dev" class="mega-menu-card" data-service="software-dev" aria-label="Software Development & Enterprise Systems">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-service-software.jpg" alt="Software Development - Enterprise ERPs & Custom Architecture" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Software Development</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 4: Digital Marketing -->
                  <a href="{rel_prefix}services/digital-marketing/" class="mega-menu-card" data-service="marketing-seo" aria-label="Digital Marketing & Growth Campaigns">
                    <div class="mega-card-media">
                      <img src="{rel_prefix}assets/mega-service-marketing.jpg" alt="Digital Marketing & Performance Optimization" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Digital Marketing</h4>
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

    is_services_active = ('services.html' in rf and rf == 'services.html')
    replacement = get_services_mega_menu_html('', is_services_active)

    pattern = r'<li[^>]*nav-item[^>]*>\s*<a href="services\.html"[^>]*>[\s\S]*?</a>\s*(?:<div class="services-mega-menu"[\s\S]*?</div>\s*</div>\s*</div>\s*)?</li>'
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
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

    replacement = get_services_mega_menu_html('../../', False)

    pattern = r'<li[^>]*nav-item[^>]*>\s*<a href="\.\./\.\./services\.html"[^>]*>[\s\S]*?</a>\s*(?:<div class="services-mega-menu"[\s\S]*?</div>\s*</div>\s*</div>\s*)?</li>'
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        with open(pf, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated project page: {pf}')
    else:
        print(f'No match in project page: {pf}')

# 3. Update Services Subpages
serv_files = glob.glob('services/*/index.html')
for sf in serv_files:
    with open(sf, 'r', encoding='utf-8') as f:
        content = f.read()

    replacement = get_services_mega_menu_html('../../', True)

    pattern = r'<li[^>]*nav-item[^>]*>\s*<a href="(?:\.\./\.\./)?services\.html"[^>]*>[\s\S]*?</a>\s*(?:<div class="services-mega-menu"[\s\S]*?</div>\s*</div>\s*</div>\s*)?</li>'
    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
        
        # Ensure portfolio-mega-menu.js script is included
        script_tag = '<script src="../../portfolio-mega-menu.js" defer></script>'
        if 'portfolio-mega-menu.js' not in content:
            content = content.replace('</body>', f'  {script_tag}\n</body>')

        with open(sf, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated services subpage: {sf}')
    else:
        print(f'No match in services subpage: {sf}')
