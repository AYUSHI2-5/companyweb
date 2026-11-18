import fs from 'fs';
import path from 'path';

function findInDir(dir, pattern, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch') {
        findInDir(fullPath, pattern, results);
      }
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(pattern)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const files1 = findInDir('.', 'nav-services-item');
console.log('Files with nav-services-item:');
files1.forEach(f => console.log(' - ' + f));

const files2 = findInDir('.', 'services-mega-menu');
console.log('\nFiles with services-mega-menu:');
files2.forEach(f => console.log(' - ' + f));
