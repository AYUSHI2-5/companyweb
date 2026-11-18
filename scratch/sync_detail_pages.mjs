import fs from 'node:fs';
import path from 'node:path';

const tplPath = 'project-detail.html';
const rawTpl = fs.readFileSync(tplPath, 'utf8');
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));

// Re-sync all projects
projects.forEach(p => {
  const slug = p.slug || p.id;
  const dir = path.join('projects', slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  // write updated index.html for each project
  // server.js dynamically pre-renders on demand, but having index.html in sync is great for static serving too
  fs.writeFileSync(path.join(dir, 'index.html'), rawTpl, 'utf8');
});

console.log(`Synced ${projects.length} project detail template directories.`);

