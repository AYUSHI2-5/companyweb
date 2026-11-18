import fs from 'fs';

const content = fs.readFileSync('admin/admin.css', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(330, 375).join('\n'));

