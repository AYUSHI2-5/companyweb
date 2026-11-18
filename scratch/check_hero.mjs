import fs from 'fs';

const content = fs.readFileSync('admin/homepage/index.html', 'utf8');
const lines = content.split('\n');
let insideHero = false;
lines.forEach((l, i) => {
  if (l.includes('id="panel-hero"')) insideHero = true;
  if (l.includes('id="panel-radar"')) insideHero = false;
  if (insideHero && (l.toLowerCase().includes('header') || l.toLowerCase().includes('nav'))) {
    console.log((i+1) + ': ' + l);
  }
});

