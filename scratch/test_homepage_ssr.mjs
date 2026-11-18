import fs from 'fs';

export function renderHomepageHtml(rawHtml, hpData) {
  try {
    const pub = (hpData && hpData.published) ? hpData.published : {};
    let html = rawHtml;

    // 1. Header Section
    if (pub.header) {
      const h = pub.header;
      if (h.cta_button) {
        if (h.cta_button.label) {
          html = html.replace(/(<a href="[^"]*" class="btn-talk"[^>]*>\s*<span>)[^<]*(<\/span>)/, `$1${h.cta_button.label}$2`);
        }
        if (h.cta_button.url) {
          html = html.replace(/(<a href=")[^"]*(" class="btn-talk")/, `$1${h.cta_button.url}$2`);
        }
      }
    }

    // 2. Hero Section
    if (pub.hero) {
      const hero = pub.hero;
      if (hero.kicker) {
        html = html.replace(/(<div class="hero-top-badge"[^>]*>[\s\S]*?<span class="badge-dot-pink"[^>]*><\/span>\s*<span>)[^<]*(<\/span>)/, `$1${hero.kicker}$2`);
      }
      if (hero.title_main || hero.title_highlight) {
        const titleHtml = `${hero.title_main || ''}<br>\n              <span class="hero-lime-tag">${hero.title_highlight || ''}</span>`;
        html = html.replace(/(<h1 class="hero-lens-headline">)[\s\S]*?(<\/h1>)/, `$1\n              ${titleHtml}\n            $2`);
      }
      if (hero.description) {
        html = html.replace(/(<p class="hero-lens-desc">)[\s\S]*?(<\/p>)/, `$1\n              ${hero.description}\n            $2`);
      }
      if (hero.cta_primary) {
        if (hero.cta_primary.label) {
          html = html.replace(/(<a href="[^"]*" class="hero-btn-dark"[^>]*>\s*<span>)[^<]*(<\/span>)/, `$1${hero.cta_primary.label}$2`);
        }
        if (hero.cta_primary.url) {
          html = html.replace(/(<a href=")[^"]*(" class="hero-btn-dark")/, `$1${hero.cta_primary.url}$2`);
        }
      }
      if (hero.cta_secondary) {
        if (hero.cta_secondary.label) {
          html = html.replace(/(<a href="[^"]*" class="hero-btn-glass"[^>]*>\s*<span>)[^<]*(<\/span>)/, `$1${hero.cta_secondary.label}$2`);
        }
        if (hero.cta_secondary.url) {
          html = html.replace(/(<a href=")[^"]*(" class="hero-btn-glass")/, `$1${hero.cta_secondary.url}$2`);
        }
      }
      if (hero.metrics_bar) {
        const mb = hero.metrics_bar;
        if (mb.reach_number) {
          html = html.replace(/(<div class="hero-stat-huge"[^>]*>)[^<]*(<\/div>)/, `$1${mb.reach_number}$2`);
        }
        if (mb.reviews_score && mb.reviews_count) {
          html = html.replace(/(<div class="hero-review-score">)[^<]*(<\/div>)/, `$1${mb.reviews_score} &middot; ${mb.reviews_count}$2`);
        }
        if (mb.reviews_subtext) {
          html = html.replace(/(<div class="hero-review-sub">)[^<]*(<\/div>)/, `$1${mb.reviews_subtext}$2`);
        }
      }
    }

    // 3. Radar Section
    if (pub.radar) {
      const rad = pub.radar;
      if (rad.kicker) {
        html = html.replace(/(<div class="radar-kicker-badge">[\s\S]*?<span class="radar-kicker-dot"><\/span>\s*<span>)[^<]*(<\/span>)/, `$1${rad.kicker}$2`);
      }
      if (rad.heading_line1 || rad.heading_highlight) {
        const radHeading = `${rad.heading_line1 || ''}<br>\n              <span class="radar-highlight-pill">${rad.heading_highlight || ''}</span>`;
        html = html.replace(/(<h2 class="radar-headline">)[\s\S]*?(<\/h2>)/, `$1\n              ${radHeading}\n            $2`);
      }
      if (rad.description) {
        html = html.replace(/(<p class="radar-subtext">)[\s\S]*?(<\/p>)/, `$1\n              ${rad.description}\n            $2`);
      }
    }

    // 4. Core Services Section (6 Accordion Cards)
    if (pub.services) {
      const srv = pub.services;
      if (srv.kicker) {
        html = html.replace(/(<div class="services-kicker-pill">[\s\S]*?<span>)[^<]*(<\/span>\s*<\/div>)/, `$1${srv.kicker}$2`);
      }
      if (srv.title_line1 || srv.title_highlight || srv.title_line2) {
        const srvTitle = `${srv.title_line1 || ''}<br>\n              <span class="lime-pill-tag">${srv.title_highlight || ''}</span> ${srv.title_line2 || ''}`;
        html = html.replace(/(<h2 class="services-main-title"[^>]*>)[\s\S]*?(<\/h2>)/, `$1\n              ${srvTitle}\n            $2`);
      }
      if (srv.subtitle) {
        html = html.replace(/(<p class="services-subtext">)[\s\S]*?(<\/p>)/, `$1\n              ${srv.subtitle}\n            $2`);
      }

      const srvItems = Array.isArray(srv.items) ? srv.items : (Array.isArray(srv) ? srv : []);
      if (srvItems.length > 0) {
        // Replace each of the 6 service items by matching its article
        srvItems.forEach((item, idx) => {
          const itemNum = idx + 1;
          const articleRegex = new RegExp(`(<article class="service-acc-item[^"]*" data-index="${itemNum}"[\\s\\S]*?<h3 class="acc-title">)[^<]*(<\\/h3>[\\s\\S]*?<input class="mockup-search-input"[^>]*value=")[^"]*("[\\s\\S]*?<p class="service-pitch-text">)[\\s\\S]*?(<\\/p>[\\s\\S]*?<span class="price-value">)[^<]*(<\\/span>)`);
          
          if (articleRegex.test(html)) {
            html = html.replace(articleRegex, (match, p1, p2, p3, p4, p5) => {
              const newTitle = item.title || '';
              const newQuery = item.mockup_query || '';
              const newPitch = `\n                      ${item.pitch || ''}\n                    `;
              const newPrice = item.starting_price || '';
              return `${p1}${newTitle}${p2}${newQuery}${p3}${newPitch}${p4}${newPrice}${p5}`;
            });
          }
        });
      }
    }

    // 5. Featured Work Section
    if (pub.featured_work) {
      const fw = pub.featured_work;
      if (fw.kicker) {
        html = html.replace(/(<div class="portfolio-kicker-capsule">[\s\S]*?<span>)[^<]*(<\/span>\s*<\/div>)/, `$1${fw.kicker}$2`);
      }
      if (fw.title_line1 || fw.title_highlight) {
        const fwTitle = `${fw.title_line1 || ''}<br>\n              <span class="text-brand-red">${fw.title_highlight || ''}</span>`;
        html = html.replace(/(<h2 class="portfolio-main-title"[^>]*>)[\s\S]*?(<\/h2>)/, `$1\n              ${fwTitle}\n            $2`);
      }
      if (fw.subtitle) {
        html = html.replace(/(<p class="portfolio-subtext">)[\s\S]*?(<\/p>)/, `$1\n              ${fw.subtitle}\n            $2`);
      }
      if (fw.cta_label) {
        html = html.replace(/(<a href="[^"]*" class="btn-all-portfolio"[^>]*>\s*<span>)[^<]*(<\/span>)/, `$1${fw.cta_label}$2`);
      }
      if (fw.cta_url) {
        html = html.replace(/(<a href=")[^"]*(" class="btn-all-portfolio")/, `$1${fw.cta_url}$2`);
      }
    }

    // 6. Case Studies Section
    if (pub.case_studies) {
      const cs = pub.case_studies;
      if (cs.kicker) {
        html = html.replace(/(<div class="case-kicker-capsule">[\s\S]*?<span>)[^<]*(<\/span>\s*<\/div>)/, `$1${cs.kicker}$2`);
      }
      if (cs.title_line1 || cs.title_highlight) {
        const csTitle = `${cs.title_line1 || ''}<br>\n              <span class="text-red-glow">${cs.title_highlight || ''}</span>`;
        html = html.replace(/(<h2 class="case-main-title"[^>]*>)[\s\S]*?(<\/h2>)/, `$1\n              ${csTitle}\n            $2`);
      }
      if (cs.subtitle) {
        html = html.replace(/(<p class="case-subtext">)[\s\S]*?(<\/p>)/, `$1\n              ${cs.subtitle}\n            $2`);
      }
    }

    // 7. How We Work Funnel Section
    if (pub.how_we_work) {
      const hww = pub.how_we_work;
      if (hww.kicker) {
        html = html.replace(/(<div class="funnel-kicker-capsule">[\s\S]*?<span>)[^<]*(<\/span>\s*<\/div>)/, `$1${hww.kicker}$2`);
      }
      if (hww.title_line1 || hww.title_highlight) {
        const hwwTitle = `${hww.title_line1 || ''}<br>\n            to <mark class="funnel-title-mark">${hww.title_highlight || ''}</mark>`;
        html = html.replace(/(<h2 class="funnel-main-title"[^>]*>)[\s\S]*?(<\/h2>)/, `$1\n            ${hwwTitle}\n          $2`);
      }
      if (hww.subtitle) {
        html = html.replace(/(<p class="funnel-subtext">)[\s\S]*?(<\/p>)/, `$1\n            ${hww.subtitle}\n          $2`);
      }
      if (Array.isArray(hww.steps)) {
        hww.steps.forEach((step, idx) => {
          const stepNum = idx + 1;
          const cardRegex = new RegExp(`(<article class="funnel-card[^"]*" role="listitem" data-step="${stepNum}">[\\s\\S]*?<h3 class="funnel-step-title">)[^<]*(<\\/h3>[\\s\\S]*?<p class="funnel-step-desc">)[\\s\\S]*?(<\\/p>)`);
          if (cardRegex.test(html)) {
            html = html.replace(cardRegex, (m, p1, p2) => {
              return `${p1}${step.title || ''}${p2}\n                ${step.desc || ''}\n              </p>`;
            });
          }
        });
      }
    }

    // 8. Next Steps CTA Section
    if (pub.next_steps) {
      const ns = pub.next_steps;
      if (ns.kicker) {
        html = html.replace(/(<section class="section-pad cta-banner-section"[\s\S]*?<div class="kicker-capsule">[\s\S]*?<span>)[^<]*(<\/span>)/, `$1${ns.kicker}$2`);
      }
      if (ns.heading) {
        html = html.replace(/(<h2 class="cta-banner-heading" id="cta-heading">)[\s\S]*?(<\/h2>)/, `$1\n                ${ns.heading.replace(/\n/g, '<br>')}\n              $2`);
      }
      if (ns.description) {
        html = html.replace(/(<p class="cta-banner-desc">)[\s\S]*?(<\/p>)/, `$1\n                ${ns.description}\n              $2`);
      }
      if (ns.cta_label) {
        html = html.replace(/(<a href="[^"]*" class="btn-pill btn-primary-pill"[^>]*>\s*<span>)[^<]*(<\/span>)/, `$1${ns.cta_label}$2`);
      }
      if (ns.cta_url) {
        html = html.replace(/(<a href=")[^"]*(" class="btn-pill btn-primary-pill")/, `$1${ns.cta_url}$2`);
      }
    }

    // 9. Canonical Footer Section
    if (pub.footer) {
      const ft = pub.footer;
      if (ft.brand_desc) {
        html = html.replace(/(<p class="footer-brand-desc">)[\s\S]*?(<\/p>)/, `$1\n            ${ft.brand_desc}\n          $2`);
      }
      if (ft.headquarters) {
        html = html.replace(/(<li class="footer-contact-item">[\s\S]*?<circle cx="12" cy="10" r="3"\/>\s*<\/svg>\s*<span>)[^<]*(<\/span>)/, `$1${ft.headquarters}$2`);
      }
      if (ft.email) {
        html = html.replace(/(<a href="mailto:)[^"]*(" class="footer-nav-link">)[^<]*(<\/a>)/, `$1${ft.email}$2${ft.email}$3`);
      }
      if (ft.hours) {
        html = html.replace(/(<polyline points="12 6 12 12 16 14"\/>\s*<\/svg>\s*<span>)[^<]*(<\/span>)/, `$1${ft.hours}$2`);
      }
      if (ft.social_linkedin) {
        html = html.replace(/(<a href=")[^"]*(" class="footer-social-btn" aria-label="LinkedIn")/, `$1${ft.social_linkedin}$2`);
      }
      if (ft.social_instagram) {
        html = html.replace(/(<a href=")[^"]*(" class="footer-social-btn" aria-label="Instagram")/, `$1${ft.social_instagram}$2`);
      }
    }

    return html;
  } catch (err) {
    console.error('Error in renderHomepageHtml:', err);
    return rawHtml;
  }
}

const raw = fs.readFileSync('index.html', 'utf8');
const hpData = JSON.parse(fs.readFileSync('data/homepage.json', 'utf8'));
const rendered = renderHomepageHtml(raw, hpData);
console.log('Original length:', raw.length, 'Rendered length:', rendered.length);
console.log('Rendered successfully!');
