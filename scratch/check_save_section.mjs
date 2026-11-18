import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1350, 1400).join('\n'));

