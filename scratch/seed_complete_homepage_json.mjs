import fs from 'fs';

const baseline = JSON.parse(fs.readFileSync('scratch/baseline_homepage.json', 'utf8'));

let current = {};
if (fs.existsSync('data/homepage.json')) {
  try {
    current = JSON.parse(fs.readFileSync('data/homepage.json', 'utf8'));
  } catch (e) {}
}

const existingPublished = current.published || {};
const existingDraft = current.draft || {};

// Merge baseline with any existing customizations
const mergedPublished = { ...baseline, ...existingPublished };
const mergedDraft = { ...baseline, ...existingDraft };

const sectionStatus = current.section_status || {
  header: 'published',
  hero: 'published',
  radar: 'published',
  services: 'published',
  featured_work: 'published',
  case_studies: 'published',
  how_we_work: 'published',
  next_steps: 'published',
  footer: 'published'
};

const fullHomepageData = {
  version: (current.version || 1) + 1,
  last_published: new Date().toISOString(),
  published: mergedPublished,
  draft: mergedDraft,
  section_status: sectionStatus,
  history: current.history || []
};

fs.writeFileSync('data/homepage.json', JSON.stringify(fullHomepageData, null, 2), 'utf8');
console.log('Successfully initialized data/homepage.json with all 9 sections!');

