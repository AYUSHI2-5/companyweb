import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const p = html.indexOf('id="portfolio-mega-menu"');
console.log(html.substring(p, p + 800));
