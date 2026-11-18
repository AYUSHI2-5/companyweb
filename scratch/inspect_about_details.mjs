import fs from 'fs';

const html = fs.readFileSync('about.html', 'utf8');

console.log('=== CAPABILITIES BLOCK ===');
const capsStart = html.indexOf('<section class="skills-metrics-section"');
console.log(html.substring(capsStart, capsStart + 3200));

console.log('=== APPROACH BLOCK ===');
const approachStart = html.indexOf('<section class="section-pad approach-section"');
console.log(html.substring(approachStart, approachStart + 3500));

console.log('=== PRINCIPLES BLOCK ===');
const statsStart = html.indexOf('<section class="section-pad stats-section">');
console.log(html.substring(statsStart, statsStart + 3500));

console.log('=== TEAM BLOCK ===');
const teamStart = html.indexOf('<section class="section-pad team-section"');
console.log(html.substring(teamStart, teamStart + 4200));

console.log('=== TESTIMONIALS BLOCK ===');
const testStart = html.indexOf('<section class="section-pad testimonials-section"');
console.log(html.substring(testStart, testStart + 4100));
