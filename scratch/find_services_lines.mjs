import fs from 'fs';
const html = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('Services') || line.includes('services')) {
    console.log(`${idx + 1}: ${line.trim().substring(0, 100)}`);
  }
});

