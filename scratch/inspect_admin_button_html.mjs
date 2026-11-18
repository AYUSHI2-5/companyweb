import fs from 'fs';

const c = fs.readFileSync('projects/lpg-booking/index.html', 'utf8');
const idx = c.indexOf('Manage in Admin');
console.log(c.slice(idx - 400, idx + 200));
