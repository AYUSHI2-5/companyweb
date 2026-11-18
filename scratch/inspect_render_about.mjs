import fs from 'fs';

const server = fs.readFileSync('server.js', 'utf8');
const idx = server.indexOf('function renderAboutHtml');
if (idx !== -1) {
  console.log(server.slice(idx, idx + 1200));
} else {
  console.log('renderAboutHtml not found');
}

