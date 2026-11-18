import fs from 'node:fs';

const html = fs.readFileSync('portfolio.html', 'utf8');
const cardRegex = /<article class="portfolio-card portfolio-card-item scroll-reveal" data-category="([^"]+)">([\s\S]*?)<\/article>/g;

let count = 0;
let match;
while ((match = cardRegex.exec(html)) !== null) {
  count++;
  const cat = match[1];
  const inner = match[2];
  const title = (inner.match(/<h3 class="portfolio-card-title">(.*?)<\/h3>/) || [])[1];
  const link = (inner.match(/<a href="([^"]+)" class="btn-portfolio-view"/) || [])[1];
  const allLinks = [...inner.matchAll(/<a\b[^>]*>/g)];
  if (allLinks.length !== 1) {
    console.log(`Card ${count} has ${allLinks.length} links!`);
  }
  console.log(`${count}. [${cat}] ${title} -> ${link}`);
}
console.log('Total cards matched:', count);
