import fs from 'fs';
const hp = JSON.parse(fs.readFileSync('data/homepage.json', 'utf8'));
console.log('Homepage published.services:\n', JSON.stringify(hp.published?.services, null, 2));

