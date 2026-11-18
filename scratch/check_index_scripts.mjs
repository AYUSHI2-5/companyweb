import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
console.log('Includes homepage-cms.js?', html.includes('homepage-cms.js'));
const scripts = html.match(/<script[^>]*src=["'][^"']+["'][^>]*>/gi);
console.log('Scripts in index.html:', scripts);

