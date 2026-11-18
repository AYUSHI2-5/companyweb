import fs from 'fs';

const html = fs.readFileSync('admin/homepage/index.html', 'utf8');

// Find all tabs or section headers
const tabMatches = html.match(/data-hp-tab=["'][^"']+["']/g) || [];
console.log('Tabs in admin/homepage/index.html:');
console.log(tabMatches);

// Find all panels
const panelMatches = html.match(/id=["']panel-[^"']+["']/g) || [];
console.log('Panels in admin/homepage/index.html:');
console.log(panelMatches);

// Find title of each panel
const titles = html.match(/<h3 class="card-title"[^>]*>[\s\S]*?<\/h3>/gi) || [];
console.log('Card titles in admin/homepage/index.html:');
titles.slice(0, 20).forEach(t => console.log(' - ' + t.replace(/<[^>]+>/g, '').trim()));

