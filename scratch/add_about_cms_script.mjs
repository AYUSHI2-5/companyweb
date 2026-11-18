import fs from 'fs';

let html = fs.readFileSync('about.html', 'utf8');
if (!html.includes('about-page-cms.js')) {
  html = html.replace(
    '<script src="portfolio-mega-menu.js" defer></script>',
    '<script src="portfolio-mega-menu.js" defer></script>\r\n  <script src="about-page-cms.js" defer></script>'
  );
  fs.writeFileSync('about.html', html, 'utf8');
  console.log('Successfully added about-page-cms.js script to about.html');
} else {
  console.log('already present');
}
