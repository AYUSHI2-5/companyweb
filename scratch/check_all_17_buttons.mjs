import fs from 'fs';
import path from 'path';

const files = [
  'project-detail.html',
  ...fs.readdirSync('projects')
    .filter(d => fs.statSync(path.join('projects', d)).isDirectory())
    .map(d => path.join('projects', d, 'index.html'))
];

console.log(`Checking ${files.length} project files...`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Look for admin-edit-link anchor tag
  const regex = /<a[^>]*id=["']admin-edit-link["'][\s\S]*?<\/a>/i;
  const match = content.match(regex);
  if (!match) {
    console.log(`[NO MATCH] ${file}`);
  } else {
    console.log(`[MATCH] ${file}: ${match[0].replace(/\s+/g, ' ').slice(0, 80)}...`);
  }
}
