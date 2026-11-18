import fs from 'fs';
const html = fs.readFileSync('admin/homepage/index.html', 'utf8');
const regex = /id=["']tab-([^"']+)["']/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[1]);
}

