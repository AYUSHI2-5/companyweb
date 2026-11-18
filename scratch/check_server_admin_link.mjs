import fs from 'fs';

const c = fs.readFileSync('server.js', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('btn-admin-manage') || l.includes('admin-edit-link') || l.includes('Manage in Admin')) {
    console.log(`server.js:${i+1}: ${l}`);
  }
});
