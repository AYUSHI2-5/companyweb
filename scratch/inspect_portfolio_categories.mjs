import fs from 'fs';

const html = fs.readFileSync('portfolio.html', 'utf8');

// Find all category sections and articles
const sectionRegex = /<div class="portfolio-category-section" data-category="([^"]+)">[\s\S]*?<h2 class="category-heading">([^<]+)<\/h2>/g;
let match;
console.log('--- CATEGORY SECTIONS IN portfolio.html ---');
while ((match = sectionRegex.exec(html)) !== null) {
  console.log(`Section: data-category="${match[1]}", Heading="${match[2]}"`);
}

// Find all filter buttons
const filterRegex = /<button class="portfolio-filter-btn[^"]*" data-filter="([^"]+)"[^>]*>([^<]+)<\/button>/g;
console.log('\n--- FILTER BUTTONS IN portfolio.html ---');
while ((match = filterRegex.exec(html)) !== null) {
  console.log(`Filter: data-filter="${match[1]}", Label="${match[2]}"`);
}

// Find articles with data-category
const articleRegex = /<article class="portfolio-card[^"]*" data-category="([^"]+)">[\s\S]*?<h3 class="portfolio-card-title">([^<]+)<\/h3>/g;
console.log('\n--- ARTICLES IN portfolio.html ---');
while ((match = articleRegex.exec(html)) !== null) {
  console.log(`Project: "${match[2]}" -> data-category="${match[1]}"`);
}
