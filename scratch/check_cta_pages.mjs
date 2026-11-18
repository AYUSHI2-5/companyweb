import fs from 'node:fs';

const pages = ['index.html', 'portfolio.html', 'about.html', 'services.html', 'project-detail.html'];
for (const p of pages) {
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const match = html.match(/<div class="cta-banner-card[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/);
    console.log(`=== ${p} ===`);
    if (match) {
      console.log(match[0].slice(0, 400));
    } else {
      console.log('No cta-banner-card match');
    }
  }
}
