import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

function inspectSection(id, label) {
  const start = html.indexOf(`id="${id}"`);
  if (start === -1) {
    console.log(`[NOT FOUND] ${id} (${label})`);
    return;
  }
  const snippet = html.slice(start, start + 800);
  console.log(`\n=================== ${id} (${label}) ===================`);
  console.log(snippet);
}

inspectSection('hero-section', 'Hero');
inspectSection('radar-section', 'Radar');
inspectSection('services-section', 'Services');
inspectSection('portfolio-showcase-section', 'Portfolio');
inspectSection('case-studies-section', 'Case Studies');
inspectSection('funnel-section', 'How We Work');
inspectSection('cta-section', 'Next Steps / CTA');
inspectSection('site-footer', 'Footer');

