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
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allHtml = walk('.');
const matchedFiles = [];
for (const f of allHtml) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('nav-services-item') || content.includes('services-mega-menu')) {
    matchedFiles.push(f);
  }
}

for (const f of ['index.html', 'services.html', 'services/application-development/index.html', 'projects/kp-e-services/index.html']) {
  const norm = f.replace(/\//g, path.sep);
  if (fs.existsSync(norm)) {
    const content = fs.readFileSync(norm, 'utf8');
    // match <li ... id="nav-services-item" ... </li>
    // Note that mega menu has nested divs, so we need to match carefully up to the closing </li> of this item
    const idx = content.indexOf('id="nav-services-item"');
    if (idx !== -1) {
      const start = content.lastIndexOf('<li', idx);
      // find closing </li>
      // Look for the next <li id="nav-portfolio-item" or </nav> or similar
      const nextLi = content.indexOf('<li', idx + 20);
      console.log(`\n================= ${norm} =================`);
      console.log('Snippet from start of li to next li:');
      console.log(content.slice(start, nextLi));
    }
  }
}
