import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('const SECTIONS') || l.includes('SECTIONS =') || l.includes('sectionKeys') || l.includes('publishAllSections')) {
    console.log((i+1) + ': ' + l);
  }
});

