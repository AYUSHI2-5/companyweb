import fs from 'fs';
const html = fs.readFileSync('about.html', 'utf8');
const s = html.indexOf('<div class="approach-cards-grid">');
console.log(html.substring(s, s + 3000));
