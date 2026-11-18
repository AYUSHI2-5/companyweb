import fs from 'fs';
import path from 'path';

const projectDirs = fs.readdirSync('projects').filter(d => fs.statSync(path.join('projects', d)).isDirectory());

for (const dir of projectDirs) {
  const filePath = path.join('projects', dir, 'index.html');
  if (fs.existsSync(filePath)) {
    const c = fs.readFileSync(filePath, 'utf8');
    // find script tags
    const scriptMatches = c.match(/<script[\s\S]*?<\/script>/gi) || [];
    scriptMatches.forEach(s => {
      if (s.includes('admin-edit-link') || s.includes('btn-admin-manage') || s.includes('Manage in Admin')) {
        console.log(`Script reference in ${filePath}`);
      }
    });
  }
}
console.log('Checked all project scripts.');
