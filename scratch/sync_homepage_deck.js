import fs from 'fs';
import path from 'path';

export function renderFeaturedDeckHtml(featuredProjects) {
  const toRender = (featuredProjects || []).slice(0, 3);
  return toRender.map((p, idx) => {
    const numStr = (idx + 1) < 10 ? '0' + (idx + 1) : String(idx + 1);
    const rawImg = (Array.isArray(p.images) && p.images[0]) ? p.images[0] : 'assets/portfolio-hero-1.png';
    const coverImg = rawImg.replace(/^\/+/, '');
    const techTags = (Array.isArray(p.technologies) ? p.technologies : []).slice(0, 3)
      .map(t => `<span class="feature-tech-pill">${t}</span>`).join('\n                  ');
    const slug = p.slug || p.id;
    const detailUrl = `projects/${slug}/`;
    const cleanUrl = p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'baadam.com';
    const safeTitle = (p.title || 'Untitled Project').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeDesc = (p.description || 'Enterprise technology architecture engineered by BAADAM Studio.')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeCat = (p.category || 'Featured Solution').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    const beaconClass = idx === 1 ? 'beacon-emerald' : (idx === 2 ? 'beacon-blue' : '');
    const pillClass = idx === 1 ? 'feature-live-pill feature-live-pill-emerald' : (idx === 2 ? 'feature-live-pill feature-live-pill-blue' : 'feature-live-pill');
    const liveSub = idx === 0 ? 'Automated Sanction &middot; Wallets' : (idx === 1 ? 'Cloud Diagnostics &middot; Online Reports' : 'Live Kitchen Dispatch &middot; 0% Commission');

    return `          <!-- Project ${numStr}: ${safeTitle} -->
          <a href="${detailUrl}" class="portfolio-feature-card scroll-reveal is-revealed" data-project="${p.id || slug}" aria-label="View ${safeTitle} Project Details">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">${cleanUrl}</span>
              </div>
              <div class="feature-media-overflow">
                <img src="${coverImg}" alt="${safeTitle}" class="feature-media-img" width="460" height="240" loading="lazy">
              </div>
              <div class="${pillClass}">
                <span class="live-dot-beacon ${beaconClass}"></span>
                <span>${liveSub}</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">${safeCat}</span>
                <span class="feature-kicker-idx">${numStr}</span>
              </div>
              <h3 class="feature-card-title">${safeTitle}</h3>
              <p class="feature-card-desc">
                ${safeDesc}
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  ${techTags}
                </div>
              </div>
            </div>
          </a>`;
  }).join('\n\n');
}

const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
const featured = projects.filter(p => p.at_home_page === true || p.at_home_page === 'yes' || p.at_home_page === 'true').slice(0, 3);
console.log('Syncing top 3 featured projects to index.html:', featured.map(f => f.title));

const deckHtml = renderFeaturedDeckHtml(featured);
let indexHtml = fs.readFileSync('index.html', 'utf8');

indexHtml = indexHtml.replace(/(<div class="portfolio-showcase-deck">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/, `$1\n${deckHtml}\n        $2`);
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully synced index.html with the 3 featured projects!');
