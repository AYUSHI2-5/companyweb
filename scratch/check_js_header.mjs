import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('switchSectionTab') || l.includes('populateHeader') || l.includes('activeTab') || l.includes('loadHomepageData')) {
    console.log((i+1) + ': ' + l);
  }
});

