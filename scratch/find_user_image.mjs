import fs from 'fs';
import path from 'path';

const dirs = [
  'C:/Users/Admin/Desktop/Baadam.com',
  'C:/Users/Admin/Desktop/Baadam.com/assets',
  'C:/Users/Admin/.gemini/antigravity-ide/brain/ac1bef05-1779-4e60-8ac7-dd7348616d3a/.tempmediaStorage',
  'C:/Users/Admin/.gemini/antigravity-ide/brain/ac1bef05-1779-4e60-8ac7-dd7348616d3a'
];

const all = [];
for (const d of dirs) {
  if (fs.existsSync(d)) {
    for (const f of fs.readdirSync(d)) {
      if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
        const full = path.join(d, f);
        try {
          const stat = fs.statSync(full);
          all.push({ mtime: stat.mtime, size: stat.size, path: full });
        } catch (e) {}
      }
    }
  }
}

all.sort((a,b) => b.mtime - a.mtime);
console.log(JSON.stringify(all.slice(0, 25), null, 2));
