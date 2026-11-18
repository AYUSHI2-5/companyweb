import fs from 'fs';
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));

projects.forEach(p => {
  const file = `projects/${p.slug || p.id}/index.html`;
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasFeatured = content.includes('id="proj-field-featured" style="display: inline-flex;"');
    const isBarFlex = content.includes('class="banner-badge-bar" style="display: flex;"');
    console.log(`${p.slug.padEnd(40)} | at_home_page: ${String(p.at_home_page).padEnd(5)} | featured: ${hasFeatured} | barFlex: ${isBarFlex}`);
  }
});

