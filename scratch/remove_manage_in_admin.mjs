import fs from 'fs';
import path from 'path';

const files = [
  'project-detail.html',
  ...fs.readdirSync('projects')
    .filter(d => fs.statSync(path.join('projects', d)).isDirectory())
    .map(d => path.join('projects', d, 'index.html'))
];

console.log(`Starting removal across ${files.length} project files...`);

let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Match the admin-edit-link anchor tag and its leading whitespace/newline
  // Regex matches whitespace before <a ... id="admin-edit-link" ... </a>
  const regex = /[ \t]*<a[^>]*id=["']admin-edit-link["'][\s\S]*?<\/a>\r?\n?/i;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    
    // Also clean up comment "<!-- Project URL (Field 2) & Admin Manage Action -->" to "<!-- Project URL (Field 2) -->" if present
    content = content.replace(
      '<!-- Project URL (Field 2) & Admin Manage Action -->',
      '<!-- Project URL (Field 2) -->'
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log(`[REMOVED] in ${file}`);
    count++;
  } else {
    console.log(`[NO MATCH] in ${file}`);
  }
}

console.log(`Finished: removed from ${count} files.`);
