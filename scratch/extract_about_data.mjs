import fs from 'fs';

const html = fs.readFileSync('about.html', 'utf8');

// Helper to extract text
function sliceBetween(str, startStr, endStr) {
  const start = str.indexOf(startStr);
  if (start === -1) return '';
  const end = str.indexOf(endStr, start + startStr.length);
  if (end === -1) return '';
  return str.substring(start + startStr.length, end).trim();
}

console.log('--- Inspecting Sections Detailed Content ---');

// 1. Hero
console.log('Hero kicker:', sliceBetween(html, '<span>ABOUT BAADAM</span>', '</div>'));
console.log('Hero heading:', sliceBetween(html, '<h1 class="about-hero-heading">', '</h1>'));
console.log('Hero subhead:', sliceBetween(html, '<p class="about-hero-subhead">', '</p>'));
console.log('Hero lead:', sliceBetween(html, '<p class="about-hero-lead">', '</p>'));

// 2. What We Do
const whatWeDoBlock = html.substring(html.indexOf('<section class="section-pad about-section">'), html.indexOf('</section>', html.indexOf('<section class="section-pad about-section">')));
console.log('\nWhat We Do Block length:', whatWeDoBlock.length);

// 3. Capabilities Metrics
const capsBlock = html.substring(html.indexOf('<section class="skills-metrics-section"'), html.indexOf('</section>', html.indexOf('<section class="skills-metrics-section"')));
console.log('\nCapabilities Block length:', capsBlock.length);

// 4. Approach
const approachBlock = html.substring(html.indexOf('<section class="section-pad approach-section"'), html.indexOf('</section>', html.indexOf('<section class="section-pad approach-section"')));
console.log('\nApproach Block length:', approachBlock.length);

// 5. Principles
const statsBlock = html.substring(html.indexOf('<section class="section-pad stats-section">'), html.indexOf('</section>', html.indexOf('<section class="section-pad stats-section">')));
console.log('\nPrinciples Block length:', statsBlock.length);

// 6. Team
const teamBlock = html.substring(html.indexOf('<section class="section-pad team-section"'), html.indexOf('</section>', html.indexOf('<section class="section-pad team-section"')));
console.log('\nTeam Block length:', teamBlock.length);

// 7. Testimonials
const testBlock = html.substring(html.indexOf('<section class="section-pad testimonials-section"'), html.indexOf('</section>', html.indexOf('<section class="section-pad testimonials-section"')));
console.log('\nTestimonials Block length:', testBlock.length);

// 8. CTA
const ctaBlock = html.substring(html.indexOf('<section class="section-pad cta-banner-section"'), html.indexOf('</section>', html.indexOf('<section class="section-pad cta-banner-section"')));
console.log('\nCTA Block length:', ctaBlock.length);
