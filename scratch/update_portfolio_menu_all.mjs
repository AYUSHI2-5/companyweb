import fs from 'fs';
import path from 'path';

// 1. Build the updated Portfolio Mega Menu HTML
function getPortfolioMegaMenuHtml(prefix = '') {
  return `<!-- Portfolio Image-Based Mega Menu Dropdown (Matches Portfolio Page Categories) -->
            <div class="portfolio-mega-menu" id="portfolio-mega-menu" role="region" aria-label="Portfolio Categories">
              <div class="mega-menu-inner">
                <div class="mega-menu-grid">
                  
                  <!-- Card 1: Web & Websites -->
                  <a href="${prefix}portfolio.html?filter=web" class="mega-menu-card" data-category="web" aria-label="Web & Websites Portfolio">
                    <div class="mega-card-media">
                      <img src="${prefix}assets/mega-web-services.jpg" alt="Web & Websites - High-Performing Web Platforms" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Web &amp; Websites</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 2: Mobile Applications -->
                  <a href="${prefix}portfolio.html?filter=mobile" class="mega-menu-card" data-category="mobile" aria-label="Mobile Applications Portfolio">
                    <div class="mega-card-media">
                      <img src="${prefix}assets/mega-mobile-apps.jpg" alt="Mobile Applications - iOS & Android Solutions" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Mobile Applications</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                  <!-- Card 3: Enterprise Software & ERP -->
                  <a href="${prefix}portfolio.html?filter=enterprise" class="mega-menu-card" data-category="enterprise" aria-label="Enterprise Software & ERP Portfolio">
                    <div class="mega-card-media">
                      <img src="${prefix}assets/mega-service-software.jpg" alt="Enterprise Software & ERP - Custom Business Systems" class="mega-card-img" width="360" height="240" loading="lazy">
                      <div class="mega-card-overlay" aria-hidden="true"></div>
                    </div>
                    <div class="mega-card-content">
                      <h4 class="mega-card-title">Enterprise Software &amp; ERP</h4>
                      <span class="mega-card-divider" aria-hidden="true"></span>
                    </div>
                  </a>

                </div>
              </div>
            </div>`;
}

// 2. Find all HTML files with portfolio-mega-menu and update them
function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch') {
        results = results.concat(walk(full));
      }
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('id="portfolio-mega-menu"')) {
        results.push(full);
      }
    }
  }
  return results;
}

const targetFiles = walk('.');
console.log(`Found ${targetFiles.length} files to update portfolio mega menu.`);

const menuRegex = /<!-- Portfolio Image-Based Mega Menu Dropdown[\s\S]*?id="portfolio-mega-menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const isDeep = file.includes('projects') && file.includes('\\');
  const prefix = isDeep ? '../../' : '';

  if (menuRegex.test(content)) {
    content = content.replace(menuRegex, getPortfolioMegaMenuHtml(prefix));
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated mega menu in: ${file}`);
  } else {
    // Try finding by id
    const startIdx = content.indexOf('<div class="portfolio-mega-menu" id="portfolio-mega-menu"');
    if (startIdx !== -1) {
      // Find the closing divs
      const searchFrom = startIdx;
      const endMarker = '</div>\n            </div>';
      const endIdx = content.indexOf('</div>\n            </div>', searchFrom);
      // fallback replace
      console.log(`Custom replace needed for ${file}`);
    }
  }
});

console.log('Portfolio mega menu updated across all pages.');
