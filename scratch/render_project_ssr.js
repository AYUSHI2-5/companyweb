import fs from 'fs';

export function deriveProjectIntro(desc) {
  if (!desc) return '';
  const firstPeriod = desc.indexOf('. ');
  if (firstPeriod > 30 && firstPeriod < 240) {
    return desc.substring(0, firstPeriod + 1);
  }
  if (desc.length <= 220) return desc;
  const trimmed = desc.substring(0, 200);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}

export function deriveProjectHashtags(project) {
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
    project.technologies.slice(0, 5).forEach(t => {
      const clean = t.replace(/[^a-zA-Z0-9]/g, '');
      if (clean && !tags.includes('#' + clean)) tags.push('#' + clean);
    });
  }
  return tags;
}

export function isProjectAtHomePage(project) {
  if (!project) return false;
  const val = project.at_home_page;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return s === 'true' || s === 'yes' || s === '1';
  }
  if (typeof val === 'number') return val === 1;
  return false;
}

export function renderProjectDetailHtml(templateHtml, project) {
  if (!project) return templateHtml;
  let html = templateHtml;

  const title = project.title || 'Untitled Project';
  const category = project.category || 'Web Application';
  const status = project.status || 'Completed';
  const month = project.service_month || '—';
  const duration = project.service_duration_days ? `${project.service_duration_days} Days` : '—';
  const desc = project.description || '';
  const shortIntro = deriveProjectIntro(desc);
  const url = project.url || '#';
  const imgs = Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png'];
  const isHome = isProjectAtHomePage(project);
  const techs = Array.isArray(project.technologies) ? project.technologies : [];
  const hashtags = deriveProjectHashtags(project);

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} — ${category} | BAADAM Studio</title>`);
  html = html.replace(/(<span class="breadcrumb-current" id="breadcrumb-current">)[^<]*(<\/span>)/, `$1${title}$2`);
  html = html.replace(/(<span id="proj-status-text">)[^<]*(<\/span>)/, `$1${status}$2`);
  html = html.replace(/(<h1 class="project-headline-title" id="proj-field-title">)[\s\S]*?(<\/h1>)/, `$1\n            ${title}\n          $2`);
  html = html.replace(/(<p class="project-header-intro" id="proj-field-intro">)[\s\S]*?(<\/p>)/, `$1\n            ${shortIntro}\n          $2`);

  // Home Featured badge: strictly visible ONLY if project is marked for home page
  if (isHome) {
    html = html.replace(/(id="proj-field-featured"[^>]*style=")[^"]*(")/, '$1display: inline-flex;$2');
    html = html.replace(/(class="banner-badge-bar"[^>]*style=")[^"]*(")/, '$1display: flex;$2');
  } else {
    html = html.replace(/(id="proj-field-featured"[^>]*style=")[^"]*(")/, '$1display: none;$2');
    html = html.replace(/(class="banner-badge-bar"[^>]*style=")[^"]*(")/, '$1display: none;$2');
  }

  // Left Column: Goals Description
  html = html.replace(/(<div class="project-goals-body" id="proj-field-description">)[\s\S]*?(<\/div>)/, `$1\n                ${desc}\n              $2`);

  // Left Column: Primary Image
  const mainSrc = '/' + imgs[0].replace(/^[\/\\]+/, '');
  html = html.replace(/(<img id="proj-main-img" src=")[^"]*(")/, `$1${mainSrc}$2`);
  html = html.replace(/(<img id="proj-main-img"[^>]*alt=")[^"]*(")/, `$1${title} — Results Interface Showcase$2`);

  // Left Column: Remaining Images (Gallery)
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

  // Right Column: Card 1 - Technologies
  if (techs.length > 0) {
    const techHtml = techs.map(t => `
            <div class="tech-badge-item">
              <span class="tech-badge-dot" aria-hidden="true"></span>
              <span>${t}</span>
            </div>`).join('\n');
    html = html.replace(/(<div class="tech-badges-grid" id="proj-field-technologies">)[\s\S]*?(<\/div>)/, `$1\n${techHtml}\n              $2`);
  }

  // Right Column: Card 2 - Service Month & Duration
  html = html.replace(/(<p class="info-card-value" id="proj-field-month">)[^<]*(<\/p>)/, `$1${month}$2`);
  html = html.replace(/(<span id="proj-field-duration">)[^<]*(<\/span>)/, `$1${duration}$2`);

  // Right Column: Card 3 - Category
  html = html.replace(/(<span class="category-badge-pill" id="proj-field-category-card">)[^<]*(<\/span>)/, `$1${category}$2`);

  // Right Column: Card 4 - Project URL
  if (url && url !== '#') {
    const cleanUrlText = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    html = html.replace(/(<a href=")[^"]*(" id="proj-field-url"[^>]*>)/, `$1${url}$2`);
    html = html.replace(/(<span id="proj-field-url-text">)[^<]*(<\/span>)/, `$1${cleanUrlText}$2`);
    html = html.replace(/(<a href=")[^"]*(" id="proj-field-url-btn"[^>]*>)/, `$1${url}$2`);
  } else {
    html = html.replace('id="proj-field-url"', 'id="proj-field-url" style="display:none;"');
    html = html.replace('id="proj-field-url-btn"', 'id="proj-field-url-btn" style="display:none;"');
  }

  // Right Column: Card 5 - Hashtags
  if (hashtags.length > 0) {
    const hashHtml = hashtags.map(h => `<span class="hashtag-pill">${h}</span>`).join('\n');
    html = html.replace(/(<div class="hashtags-grid" id="proj-field-hashtags">)[\s\S]*?(<\/div>)/, `$1\n${hashHtml}\n              $2`);
  } else {
    html = html.replace('id="proj-hashtags-card"', 'id="proj-hashtags-card" style="display:none;"');
  }

  // Inject current slug for instant client-side lookup
  const slugScript = `<script>window.BAADAM_CURRENT_SLUG = "${project.slug || project.id}";</script>`;
  html = html.replace('</head>', `${slugScript}\n</head>`);

  return html;
}

const template = fs.readFileSync('project-detail.html', 'utf8');
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
const kp = projects[0];
const rendered = renderProjectDetailHtml(template, kp);

console.log('Project title in HTML:', rendered.includes('KP E-Services'));
console.log('Project Goals in HTML:', rendered.includes('Project Goals'));
console.log('Project Results in HTML:', rendered.includes('Project Results'));
console.log('Tech badge React.js:', rendered.includes('React.js'));
console.log('Service month October 2024:', rendered.includes('October 2024'));
console.log('FinTech category pill:', rendered.includes('FinTech & Loan Operations'));
console.log('Gallery item cards:', rendered.includes('gallery-item-card'));
console.log('Hashtags #FinTech:', rendered.includes('#FinTechLoanOperations'));
