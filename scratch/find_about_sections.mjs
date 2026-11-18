import fs from 'fs';

const html = fs.readFileSync('about.html', 'utf8');
const lines = html.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('<section') || line.includes('class="about-') || line.includes('aria-labelledby')) {
    console.log(`L${idx + 1}: ${line.trim().substring(0, 120)}`);
  }
});
