import fs from 'node:fs';

const htmlFiles = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html'];

console.log('=== HTML BACKGROUND IMAGES ===');
htmlFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  imgMatches.forEach(tag => {
    if (tag.includes('bg') || tag.includes('ribbon')) {
      console.log(`${f}: ${tag}`);
    }
  });
});

console.log('\n=== CSS BACKGROUND IMAGES ===');
const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('background-image:') || (l.includes('background:') && l.includes('url('))) {
    console.log(`style.css:${i + 1}: ${l.trim()}`);
  }
});
