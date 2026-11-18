import fs from 'fs';

const server = fs.readFileSync('server.js', 'utf8');
const lines = server.split('\n');
console.log('--- server.js lines matching media or upload ---');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('media') || l.toLowerCase().includes('upload')) {
    console.log(`${i+1}: ${l}`);
  }
});

