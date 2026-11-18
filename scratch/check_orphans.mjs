import fs from 'fs';

const c = fs.readFileSync('projects/lpg-booking/index.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('btn-admin-manage') || l.includes('admin-edit-link')) {
    console.log(`${i+1}: ${l}`);
  }
});
