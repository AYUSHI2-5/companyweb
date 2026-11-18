import fs from 'fs';
import path from 'path';
import { renderProjectDetailHtml } from './render_project_ssr.js';

const templateHtml = fs.readFileSync('project-detail.html', 'utf8');
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));

console.log(`Syncing ${projects.length} project detail pages...`);

projects.forEach((proj, idx) => {
  const slug = proj.slug || proj.id;
  if (!slug) {
    console.warn(`Project at index ${idx} has no slug or id!`);
    return;
  }
  const folder = path.join('projects', slug);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const rendered = renderProjectDetailHtml(templateHtml, proj);
  const targetFile = path.join(folder, 'index.html');
  fs.writeFileSync(targetFile, rendered, 'utf8');
  console.log(`[${idx + 1}/${projects.length}] Synced -> ${targetFile}`);
});

console.log('All 16 project detail pages synced successfully!');

