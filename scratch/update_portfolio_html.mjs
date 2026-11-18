import fs from 'node:fs';

let html = fs.readFileSync('portfolio.html', 'utf8');

// Regex matching each portfolio-card article
const cardRegex = /<article class="portfolio-card portfolio-card-item scroll-reveal" data-category="([^"]+)">([\s\S]*?)<\/article>/g;

let count = 0;
const newHtml = html.replace(cardRegex, (fullMatch, cat, inner) => {
  count++;
  const titleMatch = inner.match(/<h3 class="portfolio-card-title">(.*?)<\/h3>/);
  const title = titleMatch ? titleMatch[1].trim() : 'Project';
  const linkMatch = inner.match(/<a href="([^"]+)" class="btn-portfolio-view"/);
  const link = linkMatch ? linkMatch[1].trim() : '#';

  // Remove the portfolio-card-actions block
  let cleanedInner = inner.replace(/<div class="portfolio-card-actions">[\s\S]*?<\/div>\s*<\/div>/, '</div>');

  return `<a href="${link}" class="portfolio-card portfolio-card-item scroll-reveal" data-category="${cat}" aria-label="View ${title} Project Details">${cleanedInner}</a>`;
});

console.log(`Transformed ${count} cards in portfolio.html.`);
fs.writeFileSync('portfolio.html', newHtml, 'utf8');

