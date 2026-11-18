import fs from 'node:fs';
import path from 'node:path';

const projectDetailPath = 'c:/Users/Admin/Desktop/Baadam.com/project-detail.html';
const projectsJsonPath = 'c:/Users/Admin/Desktop/Baadam.com/data/projects.json';

const template = fs.readFileSync(projectDetailPath, 'utf8');
const projects = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));

function deriveProjectHashtags(project) {
  if (Array.isArray(project.hashtags) && project.hashtags.length > 0) {
    return project.hashtags.map(h => h.startsWith('#') ? h : ('#' + h.replace(/\s+/g, '')));
  }
  if (typeof project.hashtags === 'string' && project.hashtags.trim()) {
    return project.hashtags.split(/[\s,]+/).map(h => h.startsWith('#') ? h : ('#' + h)).filter(Boolean);
  }
  const tags = [];
  if (project.category) {
    tags.push('#' + project.category.replace(/[^a-zA-Z0-9]/g, ''));
  }
  if (Array.isArray(project.technologies)) {
    project.technologies.slice(0, 4).forEach(t => {
      const clean = t.replace(/[^a-zA-Z0-9]/g, '');
      if (clean && !tags.includes('#' + clean)) tags.push('#' + clean);
    });
  }
  if (!tags.includes('#BAADAM')) tags.push('#BAADAM');
  return tags;
}

for (const p of projects) {
  const slug = p.slug || p.id;
  const targetDir = path.join('c:/Users/Admin/Desktop/Baadam.com/projects', slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let html = template;
  const title = p.title || 'Untitled Project';
  const category = p.category || 'Web Application';
  const month = p.service_month || '—';
  const duration = p.service_duration_days ? `${p.service_duration_days} Days` : '—';
  const desc = p.description || '';
  const url = p.url || '#';
  const isHome = Boolean(p.at_home_page);
  const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : ['assets/portfolio-hero-1.png'];
  const techs = Array.isArray(p.technologies) ? p.technologies : [];

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} — ${category} | BAADAM Studio</title>`);
  html = html.replace(/(<span class="breadcrumb-current" id="breadcrumb-current">)[^<]*(<\/span>)/, `$1${title}$2`);
  html = html.replace(/(<h1 class="project-headline-title" id="proj-field-title"[^>]*>)[\s\S]*?(<\/h1>)/, `$1\n            ${title}\n          $2`);

  if (isHome) {
    html = html.replace(/(id="proj-field-featured"[^>]*style=")[^"]*(")/, '$1display: inline-flex;$2');
    html = html.replace('id="proj-badge-bar"', 'id="proj-badge-bar" style="display: flex;"');
  } else {
    html = html.replace(/(id="proj-field-featured"[^>]*style=")[^"]*(")/, '$1display: none;$2');
    html = html.replace('id="proj-badge-bar"', 'id="proj-badge-bar" style="display: none;"');
  }

  html = html.replace(/(<div class="project-goals-body" id="proj-field-description">)[\s\S]*?(<\/div>)/, `$1\n                ${desc}\n              $2`);

  const mainSrc = '/' + imgs[0].replace(/^[\/\\]+/, '');
  html = html.replace(/(<img id="proj-main-img" src=")[^"]*(")/, `$1${mainSrc}$2`);
  html = html.replace(/(<img id="proj-main-img"[^>]*alt=")[^"]*(")/, `$1${title} — Results Interface Showcase$2`);

  if (imgs.length > 1) {
    html = html.replace(/(id="proj-gallery-wrap"[^>]*style="[^"]*display:\s*)none/i, '$1block');
    const galleryHtml = imgs.slice(1).map((src, i) => {
      const actualIdx = i + 1;
      const normalized = '/' + src.replace(/^[\/\\]+/, '');
      return `
              <div class="gallery-item-card" onclick="openLightbox(${actualIdx})" title="View screen #${actualIdx + 1}">
                <div class="gallery-img-wrapper">
                  <img src="${normalized}" alt="${title} Screenshot ${actualIdx + 1}" loading="lazy">
                </div>
                <div class="gallery-item-caption">
                  <span>SCREENSHOT 0${actualIdx + 1}</span>
                  <span style="color: var(--proj-red); font-weight:700;">Enlarge &rarr;</span>
                </div>
              </div>`;
    }).join('\n');
    html = html.replace(/(<div class="gallery-subgrid" id="proj-field-gallery">)[\s\S]*?(<\/div>)/, `$1\n${galleryHtml}\n                  $2`);
  } else {
    html = html.replace(/(id="proj-gallery-wrap"[^>]*style="[^"]*display:\s*)block/i, '$1none');
  }

  if (techs.length > 0) {
    const techHtml = techs.map(t => `
            <div class="tech-badge-item">
              <span class="tech-badge-dot" aria-hidden="true"></span>
              <span>${t}</span>
            </div>`).join('\n');
    html = html.replace(/(<div class="tech-badges-grid" id="proj-field-technologies">)[\s\S]*?(<\/div>)/, `$1\n${techHtml}\n              $2`);
  }

  html = html.replace(/(<p class="spec-value-text" id="proj-field-month">)[^<]*(<\/p>)/, `$1${month}$2`);
  html = html.replace(/(<span id="proj-field-duration">)[^<]*(<\/span>)/, `$1${duration}$2`);
  html = html.replace(/(<span class="category-badge-pill" id="proj-field-category-card">)[^<]*(<\/span>)/, `$1${category}$2`);

  if (url && url !== '#') {
    html = html.replace(/(<a href=")[^"]*(" id="proj-field-url"[^>]*>)/, `$1${url}$2`);
  } else {
    html = html.replace('id="proj-field-url"', 'id="proj-field-url" style="display:none;"');
    html = html.replace('id="spec-url-item"', 'id="spec-url-item" style="display:none;"');
  }

  const hashtags = deriveProjectHashtags(p);
  if (hashtags && hashtags.length > 0) {
    const hashHtml = hashtags.map(h => `<span class="hashtag-pill">${h}</span>`).join('\n                    ');
    html = html.replace(/(<div class="hashtags-grid" id="proj-field-hashtags">)[\s\S]*?(<\/div>)/, `$1\n                    ${hashHtml}\n                  $2`);
  } else {
    html = html.replace('id="spec-hashtags-item"', 'id="spec-hashtags-item" style="display:none;"');
  }

  const slugScript = `<script>window.BAADAM_CURRENT_SLUG = "${slug}";</script>`;
  html = html.replace('</head>', `${slugScript}\n</head>`);

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
}

console.log(`Synced all ${projects.length} project detail pages successfully with no big title and no hero button!`);
