import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch') {
        results = results.concat(walk(full));
      }
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('id="portfolio-mega-menu"')) {
        results.push(full);
      }
    }
  }
  return results;
}

const files = walk('.');
console.log('Files with portfolio-mega-menu:', files);
