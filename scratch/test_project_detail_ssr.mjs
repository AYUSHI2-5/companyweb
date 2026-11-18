import fs from 'fs';

const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
console.log('Loaded projects count:', projects.length);

function getShortIntro(desc) {
  if (!desc) return '';
  const firstPeriod = desc.indexOf('. ');
  if (firstPeriod > 30 && firstPeriod < 220) {
    return desc.substring(0, firstPeriod + 1);
  }
  if (desc.length <= 200) return desc;
  const trimmed = desc.substring(0, 190);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}

function getHashtags(project) {
  if (Array.isArray(project.hashtags) && project.hashtags.length > 0) {
    return project.hashtags.map(h => h.startsWith('#') ? h : ('#' + h.replace(/\s+/g, '')));
  }
  if (typeof project.hashtags === 'string' && project.hashtags.trim()) {
    return project.hashtags.split(/[\s,]+/).map(h => h.startsWith('#') ? h : ('#' + h)).filter(Boolean);
  }
  const tags = [];
  if (project.category) {
    tags.push('#' + project.category.replace(/[^a-zA-Z0-9]/g, ''));
  }
  if (Array.isArray(project.technologies)) {
    project.technologies.slice(0, 5).forEach(t => {
      tags.push('#' + t.replace(/[^a-zA-Z0-9]/g, ''));
    });
  }
  return tags;
}

const sample = projects[0];
console.log('Sample project:', sample.title);
console.log('Short intro:', getShortIntro(sample.description));
console.log('Hashtags:', getHashtags(sample));
console.log('Images count:', sample.images?.length);

