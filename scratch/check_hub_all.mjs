import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
let insideHub = false;
let count = 0;
lines.forEach((l, i) => {
  if (l.includes('id="panel-hub"')) insideHub = true;
  if (insideHub && count < 50) {
    console.log((i+1) + ': ' + l);
    count++;
  }
});

