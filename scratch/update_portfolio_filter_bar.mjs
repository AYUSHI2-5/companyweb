import fs from 'fs';

let c = fs.readFileSync('portfolio.html', 'utf8');
const filterStart = c.indexOf('<div class="portfolio-filter-bar');
const filterEnd = c.indexOf('</div>', filterStart) + 6;

const oldBlock = c.substring(filterStart, filterEnd);
const newBlock = `<div class="portfolio-filter-bar scroll-reveal" role="tablist" aria-label="Filter portfolio by category">
          <button class="portfolio-filter-btn is-active" data-filter="all" type="button" role="tab" aria-selected="true">All Projects (16)</button>
          <button class="portfolio-filter-btn" data-filter="web" type="button" role="tab" aria-selected="false">Web &amp; Websites (9)</button>
          <button class="portfolio-filter-btn" data-filter="mobile" type="button" role="tab" aria-selected="false">Mobile Applications (4)</button>
          <button class="portfolio-filter-btn" data-filter="enterprise" type="button" role="tab" aria-selected="false">Enterprise Software &amp; ERP (3)</button>
        </div>`;

c = c.replace(oldBlock, newBlock);

// Also clean up any lingering 'creative' or 'marketing' secondary classes on project cards
c = c.replace('data-category="web creative"', 'data-category="web"');
c = c.replace('data-category="web creative"', 'data-category="web"');
c = c.replace('data-category="web marketing"', 'data-category="web"');
c = c.replace('data-category="mobile creative"', 'data-category="mobile"');
c = c.replace('data-category="enterprise marketing"', 'data-category="enterprise"');

fs.writeFileSync('portfolio.html', c, 'utf8');
console.log('portfolio.html filter bar and categories updated successfully!');
