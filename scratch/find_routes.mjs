import fs from 'fs';

const content = fs.readFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/8b148c84-3c2a-428d-a242-59e1a1ea8c82/.system_generated/steps/580/content.md', 'utf8');

const regex = /href=["']([^"']+)["']/g;
const hrefs = [];
let match;
while ((match = regex.exec(content)) !== null) {
  hrefs.push(match[1]);
}

const uniqueHrefs = [...new Set(hrefs)].filter(h => h.startsWith('/') || h.includes('joyful-studies') || h.includes('reachwise'));
console.log('Routes / Links found:', uniqueHrefs);
