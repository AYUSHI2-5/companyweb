import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('brain') && !fullPath.includes('.system_generated') && !fullPath.includes('scratch')) {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
let found = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('Manage in Admin') || content.includes('admin-edit-link')) {
    console.log('Found in:', file);
    found++;
  }
}
if (found === 0) {
  console.log('CONFIRMED: ZERO occurrences of "Manage in Admin" or "admin-edit-link" found across all HTML files!');
}
