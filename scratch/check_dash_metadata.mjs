import fs from 'fs';

const content = fs.readFileSync('admin/dashboard.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(165, 185).join('\n'));

