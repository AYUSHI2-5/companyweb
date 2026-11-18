import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('data-tab') || l.includes('hp-tab-panel') || l.includes('hp-nav-pill')) {
    console.log((i+1) + ': ' + l);
  }
});

