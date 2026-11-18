import fs from 'fs';
import path from 'path';

const files = [
  'project-detail.html',
  ...fs.readdirSync('projects')
    .filter(d => fs.statSync(path.join('projects', d)).isDirectory())
    .map(d => path.join('projects', d, 'index.html'))
];

console.log(`Cleaning CSS and JS from ${files.length} project files...`);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove CSS .btn-admin-manage block
  const cssRegex = /[ \t]*\.btn-admin-manage\s*\{[\s\S]*?\.btn-admin-manage:hover\s*\{[\s\S]*?\}\r?\n?/i;
  content = content.replace(cssRegex, '');

  // Remove JS adminLink block
  const jsRegex = /[ \t]*\/\/[^\n]*Link directly to editing[^\n]*\r?\n[ \t]*const adminLink = document\.getElementById\('admin-edit-link'\);\r?\n[ \t]*if \(adminLink\) \{[\s\S]*?\}\r?\n?/i;
  content = content.replace(jsRegex, '');

  fs.writeFileSync(file, content, 'utf8');
}

console.log('Cleanup completed.');
