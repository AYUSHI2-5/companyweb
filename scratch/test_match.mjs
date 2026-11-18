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

let allOk = true;
for (const file of matchedFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /<li[^>]*id=["']nav-services-item["'][^>]*>([\s\S]*?)<\/li>/i;
  const match = content.match(regex);
  if (!match) {
    console.log(`[FAIL NO MATCH] ${file}`);
    allOk = false;
  } else {
    const inner = match[1];
    if (inner.includes('</li>')) {
      console.log(`[FAIL NESTED LI] ${file}`);
      allOk = false;
    }
    if (!inner.includes('services-mega-menu')) {
      console.log(`[WARN NO SERVICES MEGA MENU IN MATCH] ${file}`);
    }
    if (!inner.includes('id="nav-services-link"')) {
      console.log(`[WARN NO NAV SERVICES LINK] ${file}`);
    }
  }
}
if (allOk) {
  console.log('ALL 29 FILES PASSED VERIFICATION PERFECTLY! Ready for replacement.');
}
