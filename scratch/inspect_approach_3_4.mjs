import fs from 'fs';
const html = fs.readFileSync('about.html', 'utf8');
const s = html.indexOf('<!-- Card 3: Traffic & Software Solutions -->');
console.log(html.substring(s, s + 1500));
