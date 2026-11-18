import fs from 'fs';

const files = [
  'project-detail.html',
  'projects/lpg-booking/index.html',
  'projects/realtybizhub/index.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const c = fs.readFileSync(file, 'utf8');
    const idx = c.indexOf('btn-admin-manage');
    if (idx !== -1) {
      console.log(`\n=== ${file} ===`);
      console.log(c.slice(idx - 300, idx + 400));
    }
  }
}
