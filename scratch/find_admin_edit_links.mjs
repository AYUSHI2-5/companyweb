import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('brain') && !fullPath.includes('.system_generated')) {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('admin-edit-link') || content.includes('btn-admin-manage')) {
    console.log(`Found in: ${file}`);
  }
}
