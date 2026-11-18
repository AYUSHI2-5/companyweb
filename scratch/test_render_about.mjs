import fs from 'fs';

const rawHtml = fs.readFileSync('about.html', 'utf8');
const aboutData = JSON.parse(fs.readFileSync('data/about_page.json', 'utf8'));

function renderAboutHtml(html, data) {
  try {
    const pub = data && data.published ? data.published : {};

    // 1. Hero Section
    if (pub.hero) {
      if (pub.hero.heading) {
        html = html.replace(/(<h1 class="about-hero-heading">)[\s\S]*?(<\/h1>)/, `$1\n              ${pub.hero.heading}\n            $2`);
      }
      if (pub.hero.subhead) {
        html = html.replace(/(<p class="about-hero-subhead">)[\s\S]*?(<\/p>)/, `$1\n              ${pub.hero.subhead}\n            $2`);
      }
      if (pub.hero.lead) {
        html = html.replace(/(<p class="about-hero-lead">)[\s\S]*?(<\/p>)/, `$1\n              ${pub.hero.lead}\n            $2`);
      }
      if (pub.hero.image) {
        html = html.replace(/(class="about-office-showcase-img"[^>]*src=")[^"]*(")/, `$1${pub.hero.image}$2`);
        html = html.replace(/(src=")[^"]*("[^>]*class="about-office-showcase-img")/, `$1${pub.hero.image}$2`);
      }
    }

    // 2. What We Do Section
    if (pub.what_we_do) {
      const wwd = pub.what_we_do;
      if (wwd.image) {
        html = html.replace(/(class="about-office-img"[^>]*src=")[^"]*(")/, `$1${wwd.image}$2`);
        html = html.replace(/(src=")[^"]*("[^>]*class="about-office-img")/, `$1${wwd.image}$2`);
      }
    }

    // 3. Team Section
    if (pub.team && Array.isArray(pub.team.members) && pub.team.members.length > 0) {
      const teamCards = pub.team.members.map(m => `
          <article class="team-card scroll-reveal is-revealed" style="width: 100%;">
            <div class="team-card-image-wrap">
              <img src="${m.image || 'assets/team-placeholder.jpg'}" alt="${m.name} - ${m.role}" class="team-card-img" width="290" height="310" onerror="this.src='/assets/team-mk-parmar.jpg'">
            </div>
            <div class="team-card-content">
              <h3 class="team-card-name">${m.name}</h3>
              <div class="team-card-role">${m.role}</div>
              <p class="team-card-desc">${m.desc || ''}</p>
            </div>
          </article>`).join('\n');
      
      const teamGridRegex = /(<div class="team-cards-grid"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>\s*<!-- Client Testimonials)/;
      html = html.replace(teamGridRegex, `$1\n${teamCards}\n        $2`);
    }

    // 4. Testimonials Section
    if (pub.testimonials && Array.isArray(pub.testimonials.items) && pub.testimonials.items.length > 0) {
      const testCards = pub.testimonials.items.map(t => {
        const stars = '★'.repeat(t.stars || 5);
        return `
          <article class="testimonial-card scroll-reveal is-revealed" role="listitem">
            <div class="testimonial-header">
              <div class="testimonial-stars" aria-label="${t.stars || 5} out of 5 stars">${stars}</div>
              <span class="testimonial-tag">${t.tag || 'Client Feedback'}</span>
            </div>
            <p class="testimonial-quote">&ldquo;${t.quote}&rdquo;</p>
            <div class="testimonial-author-wrap">
              <div class="testimonial-avatar" aria-hidden="true">${t.avatar || t.author.substring(0, 2).toUpperCase()}</div>
              <div class="testimonial-author-info">
                <h3 class="testimonial-author-name">${t.author}</h3>
                <div class="testimonial-author-role">${t.role}</div>
              </div>
            </div>
          </article>`;
      }).join('\n');

      const testGridRegex = /(<div class="testimonials-grid"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>\s*<!-- Full-Width Agency CTA Banner)/;
      html = html.replace(testGridRegex, `$1\n${testCards}\n        $2`);
    }

    return html;
  } catch (e) {
    console.error('Error in renderAboutHtml:', e);
    return html;
  }
}

const rendered = renderAboutHtml(rawHtml, aboutData);
console.log('Original length:', rawHtml.length, 'Rendered length:', rendered.length);
console.log('Render test completed successfully!');
