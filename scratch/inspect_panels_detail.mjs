import fs from 'fs';

const html = fs.readFileSync('admin/homepage/index.html', 'utf8');

// Find all panels and their headings
const panels = html.split('<div class="hp-tab-panel"');
console.log('Total panels:', panels.length - 1);

panels.slice(1).forEach((p, idx) => {
  const idMatch = p.match(/id="([^"]+)"/);
  const titleMatch = p.match(/<div class="section-editor-title">([\s\S]*?)<\/div>/);
  const cards = p.match(/<h3 class="card-title"[^>]*>([\s\S]*?)<\/h3>/g) || [];
  
  console.log(`\nPanel ${idx + 1}: ${idMatch ? idMatch[1] : 'unknown'}`);
  console.log(`Title: ${titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'none'}`);
  console.log('Cards:', cards.map(c => c.replace(/<[^>]+>/g, '').trim()));
});

