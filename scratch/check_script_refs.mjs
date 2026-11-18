import fs from 'fs';

const c = fs.readFileSync('project-detail.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('admin-edit-link') || l.includes('btn-admin-manage') || l.includes('Manage in Admin')) {
    console.log(`${i+1}: ${l}`);
  }
});
