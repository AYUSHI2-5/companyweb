import fs from 'node:fs';
import path from 'node:path';

// Root level files: href="services.html#software-dev" -> href="services/software-development/"
const rootFiles = ['about.html', 'contact.html', 'index.html', 'portfolio.html', 'project-detail.html', 'admin.html'];
for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('href="services.html#software-dev"')) {
      content = content.replaceAll('href="services.html#software-dev"', 'href="services/software-development/"');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated root file:', file);
    }
  }
}

// Subdirectory files under services/*/index.html
const subdirs = ['application-development', 'digital-marketing', 'website-development'];
for (const sub of subdirs) {
  const file = path.join('services', sub, 'index.html');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    if (content.includes('href="../../services.html#software-dev"')) {
      content = content.replaceAll('href="../../services.html#software-dev"', 'href="../../services/software-development/"');
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated service subpage:', file);
    }
  }
}

console.log('All links updated successfully!');
