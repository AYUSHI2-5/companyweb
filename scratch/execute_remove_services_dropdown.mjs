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

console.log(`Starting replacement across ${matchedFiles.length} files...`);

const regex = /<li[^>]*id=["']nav-services-item["'][^>]*>([\s\S]*?)<\/li>/i;

let updatedCount = 0;

for (const file of matchedFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const match = content.match(regex);
  if (!match) {
    console.error(`Could not match in ${file}`);
    continue;
  }

  const inner = match[1];
  const hrefMatch = inner.match(/href=["']([^"']+)["']/i);
  const href = hrefMatch ? hrefMatch[1] : 'services.html';
  const isActive = inner.includes(' active') || inner.includes('active ');

  const isCRLF = content.includes('\r\n');
  const eol = isCRLF ? '\r\n' : '\n';

  const replacement = `<li class="nav-item">${eol}            <a href="${href}" class="nav-link${isActive ? ' active' : ''}">Services</a>${eol}          </li>`;

  const newContent = content.replace(regex, replacement);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log(`Updated ${file} -> href="${href}", active=${isActive}`);
  updatedCount++;
}

console.log(`Successfully updated ${updatedCount} files.`);
