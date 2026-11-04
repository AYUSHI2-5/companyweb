const fs = require('fs');
const path = require('path');

const files = ['index.html', 'services.html', 'portfolio.html', 'about.html', 'contact.html'];
let hasErrors = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log('--- Checking', file, '---');
  
  // Check image paths
  const imgRegex = /src=["']([^"']+)["']/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('data:')) {
      if (!fs.existsSync(src)) {
        console.error('ERROR: Missing image src:', src, 'in', file);
        hasErrors = true;
      } else {
        console.log('  OK Image:', src);
      }
    }
  }

  // Check internal href paths
  const hrefRegex = /href=["']([^"']+)["']/g;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.endsWith('.html') || href.includes('.html#')) {
      const cleanFile = href.split('#')[0];
      if (!fs.existsSync(cleanFile)) {
        console.error('ERROR: Missing href file:', cleanFile, 'in', file);
        hasErrors = true;
      }
    }
  }
});

if (!hasErrors) {
  console.log('\n>>> ALL IMAGE AND INTERNAL HREF PATHS ARE 100% VALID! <<<');
} else {
  process.exit(1);
}
