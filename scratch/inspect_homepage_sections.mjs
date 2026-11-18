import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Find all HTML comments or top-level semantic tags in index.html
const lines = html.split('\n');
console.log('--- Scanning index.html for major section headers and comments ---');
lines.forEach((line, i) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('<!--') && (trimmed.includes('SECTION') || trimmed.includes('Section') || trimmed.includes('Hero') || trimmed.includes('Services') || trimmed.includes('Portfolio') || trimmed.includes('Case') || trimmed.includes('Footer') || trimmed.includes('CTA') || trimmed.includes('Work') || trimmed.includes('Header'))) {
    console.log(`Line ${i + 1}: ${trimmed}`);
  }
  if (trimmed.startsWith('<section') || (trimmed.startsWith('<header') && !trimmed.includes('<h')) || trimmed.startsWith('<footer')) {
    console.log(`Line ${i + 1} TAG: ${trimmed.slice(0, 100)}`);
  }
});

