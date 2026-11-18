import fs from 'fs';

const rawTemplate = fs.readFileSync('scratch/new_project_detail.html', 'utf8');
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));

function deriveIntro(desc) {
  if (!desc) return '';
  const firstPeriod = desc.indexOf('. ');
  if (firstPeriod > 30 && firstPeriod < 220) {
    return desc.substring(0, firstPeriod + 1);
  }
  if (desc.length <= 200) return desc;
  const trimmed = desc.substring(0, 190);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}

function renderProjectDetailHtml(templateHtml, project) {
  if (!project) return templateHtml;
  let html = templateHtml;

  const title = project.title || 'Untitled Project';
  const category = project.category || 'Web Application';
  const status = project.status || 'Completed';
  const month = project.service_month || '—';
  const duration = project.service_duration_days ? `${project.service_duration_days} Days` : '—';
  const desc = project.description || '';
  const shortIntro = deriveIntro(desc);
  const url = project.url || '#';
  const imgs = Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png'];
  const isHome = project.at_home_page === true || project.at_home_page === 'yes' || project.at_home_page === 'true';

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} — ${category} | BAADAM Studio</title>`);
  html = html.replace(/(<span class="breadcrumb-current" id="breadcrumb-current">)[^<]*(<\/span>)/, `$1${title}$2`);
  html = html.replace(/(<span class="badge-category" id="proj-field-category">)[^<]*(<\/span>)/, `$1${category}$2`);
  html = html.replace(/(<span id="proj-status-text">)[^<]*(<\/span>)/, `$1${status}$2`);
  html = html.replace(/(<div class="meta-card-value" id="proj-field-status-card">)[^<]*(<\/div>)/, `$1${status}$2`);
  html = html.replace(/(<h1 class="project-headline-title" id="proj-field-title">)[\s\S]*?(<\/h1>)/, `$1\n          ${title}\n        $2`);
  html = html.replace(/(<p class="project-header-intro" id="proj-field-intro">)[\s\S]*?(<\/p>)/, `$1\n          ${shortIntro}\n        $2`);
  html = html.replace(/(<a href=")[^"]*(" id="proj-field-url")/, `$1${url}$2`);
  html = html.replace(/(<div class="meta-card-value" id="proj-field-month">)[^<]*(<\/div>)/, `$1${month}$2`);
  html = html.replace(/(<div class="meta-card-value" id="proj-field-duration">)[^<]*(<\/div>)/, `$1${duration}$2`);
  html = html.replace(/(<div class="meta-card-value" id="proj-field-category-card"[^>]*>)[^<]*(<\/div>)/, `$1${category}$2`);
  html = html.replace(/(<p class="description-body" id="proj-field-description">)[\s\S]*?(<\/p>)/, `$1\n            ${desc}\n          $2`);

  const mainSrc = '/' + imgs[0].replace(/^\//, '');
  html = html.replace(/(<img id="proj-main-img" src=")[^"]*(")/, `$1${mainSrc}$2`);

  const slugScript = `<script>window.BAADAM_CURRENT_SLUG = "${project.slug || project.id}";</script>`;
  html = html.replace('</head>', `${slugScript}\n</head>`);

  return html;
}

const rendered = renderProjectDetailHtml(rawTemplate, projects[0]);
console.log('Original length:', rawTemplate.length, 'Rendered length:', rendered.length);
console.log('Has title:', rendered.includes('KP E-Services'));
console.log('Has category:', rendered.includes('FinTech & Loan Operations'));
console.log('Has intro:', rendered.includes('A comprehensive loan operations platform'));
console.log('Has slugScript:', rendered.includes('window.BAADAM_CURRENT_SLUG = "kp-e-services"'));

