import fs from 'fs';

const rawHtml = fs.readFileSync('services.html', 'utf8');

const regex = /(<div class="services-showcase-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>\s*<!-- Full-Width Agency CTA Banner -->)/;
const match = rawHtml.match(regex);
console.log('Match found:', !!match);
if (match) {
  console.log('Replaced block cleanly!');
}
