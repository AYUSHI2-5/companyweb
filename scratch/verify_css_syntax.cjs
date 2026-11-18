const fs = require('fs');

const css = fs.readFileSync('style.css', 'utf8');

// Basic bracket/brace balance check
let openBraces = 0;
let closeBraces = 0;

for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') openBraces++;
  if (css[i] === '}') closeBraces++;
}

console.log(`Open braces: ${openBraces}, Close braces: ${closeBraces}`);
if (openBraces === closeBraces) {
  console.log('CSS braces are perfectly balanced!');
} else {
  console.error(`Mismatch! Difference: ${openBraces - closeBraces}`);
}

// Check key services rules exist
const checks = [
  '.services-section.services-pinned-content',
  '.services-accordion-stack',
  '.service-acc-item.is-active',
  '.service-acc-item.is-active .service-acc-body',
  '.acc-body-grid',
  'overflow-y: auto',
  'max-height: none',
  '@media (max-height: 850px)',
  '@media (max-height: 720px)'
];

checks.forEach(c => {
  console.log(`Check "${c}":`, css.includes(c) ? 'PASS' : 'FAIL');
});

