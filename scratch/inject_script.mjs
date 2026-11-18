import fs from 'node:fs';

let html = fs.readFileSync('services.html', 'utf8');
if (!html.includes('services-page-cms.js')) {
  html = html.replace('</body>', '  <script src="services-page-cms.js" defer></script>\n</body>');
  fs.writeFileSync('services.html', html, 'utf8');
  console.log('Appended services-page-cms.js script to services.html');
} else {
  console.log('Already included');
}
