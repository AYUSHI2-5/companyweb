import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
let insideHub = false;
lines.forEach((l, i) => {
  if (l.includes('id="panel-hub"')) insideHub = true;
  if (insideHub && (l.includes('Header') || l.includes('header') || l.includes('01.'))) {
    console.log((i+1) + ': ' + l);
  }
});

