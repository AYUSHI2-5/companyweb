import fs from 'fs';

const s = fs.readFileSync('server.js', 'utf8');
const lines = s.split('\n');
lines.forEach((l, i) => {
  if (l.includes('homepage.json') || l.includes('homepage_data') || l.includes('HOMEPAGE_') || l.includes('renderHome') || l.includes('index.html')) {
    console.log(`${i+1}: ${l}`);
  }
});

