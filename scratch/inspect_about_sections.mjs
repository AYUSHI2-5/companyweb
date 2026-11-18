import fs from 'fs';

const html = fs.readFileSync('about.html', 'utf8');

function extractBetween(str, start, end) {
  const s = str.indexOf(start);
  if (s === -1) return null;
  const e = str.indexOf(end, s);
  if (e === -1) return null;
  return str.substring(s, e);
}

console.log('--- 1. Hero snippet ---');
console.log(html.substring(html.indexOf('<section class="page-hero'), html.indexOf('</section>', html.indexOf('<section class="page-hero')) + 10));

console.log('\n--- 2. About snippet ---');
const aboutStart = html.indexOf('<section class="section-pad about-section">');
console.log(html.substring(aboutStart, html.indexOf('</section>', aboutStart) + 10));

console.log('\n--- 3. Skills metrics snippet ---');
const skillsStart = html.indexOf('<section class="skills-metrics-section"');
console.log(html.substring(skillsStart, skillsStart + 600));

console.log('\n--- 4. Approach snippet ---');
const approachStart = html.indexOf('<section class="section-pad approach-section"');
console.log(html.substring(approachStart, approachStart + 600));

console.log('\n--- 5. Stats snippet ---');
const statsStart = html.indexOf('<section class="section-pad stats-section"');
console.log(html.substring(statsStart, statsStart + 600));

console.log('\n--- 6. Team snippet ---');
const teamStart = html.indexOf('<section class="section-pad team-section"');
console.log(html.substring(teamStart, teamStart + 600));

console.log('\n--- 7. Testimonials snippet ---');
const testStart = html.indexOf('<section class="section-pad testimonials-section"');
console.log(html.substring(testStart, testStart + 600));

console.log('\n--- 8. CTA snippet ---');
const ctaStart = html.indexOf('<section class="section-pad cta-banner-section"');
console.log(html.substring(ctaStart, ctaStart + 600));
