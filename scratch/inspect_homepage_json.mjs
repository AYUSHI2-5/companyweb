import fs from 'fs';

const hp = JSON.parse(fs.readFileSync('data/homepage.json', 'utf8'));
console.log('Top keys in data/homepage.json:', Object.keys(hp));
console.log('Published keys:', hp.published ? Object.keys(hp.published) : 'no published');
console.log('Draft keys:', hp.draft ? Object.keys(hp.draft) : 'no draft');
if (hp.published) {
  for (const k of Object.keys(hp.published)) {
    console.log(`\n--- published.${k} ---`);
    console.log(JSON.stringify(hp.published[k], null, 2).slice(0, 300));
  }
}

