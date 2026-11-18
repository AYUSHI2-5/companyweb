import fs from 'fs';

const server = fs.readFileSync('server.js', 'utf8');
const lines = server.split('\n');
lines.forEach((l, i) => {
  if (l.includes('/api/homepage') || l.includes('/api/admin/homepage')) {
    console.log(`${i+1}: ${l}`);
  }
});

