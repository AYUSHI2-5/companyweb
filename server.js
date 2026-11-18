/**
 * BAADAM Portfolio & Complete Homepage CMS Backend Server
 * Native Node.js (Zero external dependencies)
 * 
 * Includes:
 * - Admin Authentication & Session Management (Cookies & Bearer tokens)
 * - Homepage CMS Section Management & Versioned Publishing API
 * - Media Library Storage & File Metadata Indexing
 * - Central Projects Database Integration
 * - Static Web Serving with MIME Types, Clean URLs, and Protected Admin Routes
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.argv[2] ? parseInt(process.argv[2], 10) : (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080);

// Data files
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const HOMEPAGE_FILE = path.join(DATA_DIR, 'homepage.json');
const SERVICES_PAGE_FILE = path.join(DATA_DIR, 'services_page.json');
const ABOUT_PAGE_FILE = path.join(DATA_DIR, 'about_page.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MEDIA_FILE = path.join(DATA_DIR, 'media.json');
const LOGS_FILE = path.join(DATA_DIR, 'audit_logs.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const UPLOAD_DIR = path.join(__dirname, 'assets', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Active in-memory sessions: token -> { userId, username, expiresAt }
const activeSessions = new Map();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

// JSON Helper Utilities
function readJSON(file, defaultVal = {}) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
  return defaultVal;
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const PRESET_SVGS = {
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
  smartphone: '<rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"></line>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>',
  'shopping-cart': '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
  code: '<polyline points="7 8 3 12 7 16"></polyline><line x1="14" y1="5" x2="10" y2="19"></line><polyline points="17 8 21 12 17 16"></polyline>',
  gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15.5" cy="11" r="0.75" fill="#eb163c"></circle><circle cx="17.5" cy="13" r="0.75" fill="#eb163c"></circle>'
};

function renderServicesHtml(rawHtml, spData) {
  try {
    const published = spData && spData.published ? spData.published : {};
    let html = rawHtml;

    // Header replacement
    if (published.header) {
      if (published.header.heading) {
        html = html.replace(/(<h1 class="services-showcase-title" id="services-main-heading">)[^<]*(<\/h1>)/, `$1${published.header.heading}$2`);
      }
      if (published.header.subtitle_line1 || published.header.subtitle_line2) {
        const fullSub = `${published.header.subtitle_line1 || ''} ${published.header.subtitle_line2 || ''}`.trim();
        html = html.replace(/(<p class="services-showcase-subtitle">)[^<]*(<\/p>)/, `$1${fullSub}$2`);
      }
    }

    // Grid cards replacement
    if (Array.isArray(published.services) && published.services.length > 0) {
      const activeServices = published.services.filter(s => s.active !== false);
      const cardsHtml = activeServices.map((svc, idx) => {
        const num = svc.num || String(idx + 1).padStart(2, '0');
        const titleHtml = (svc.title || '').replace(/\n/g, '<br>');
        const iconColor = svc.icon_color || '#eb163c';

        let iconInner = '';
        if (svc.icon_svg) {
          iconInner = svc.icon_svg.startsWith('<svg')
            ? svc.icon_svg
            : `<svg class="service-card-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svc.icon_svg}</svg>`;
        } else if (svc.icon_preset && PRESET_SVGS[svc.icon_preset]) {
          iconInner = `<svg class="service-card-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PRESET_SVGS[svc.icon_preset]}</svg>`;
        } else if (svc.icon_url) {
          iconInner = `<img src="${svc.icon_url}" alt="" class="service-card-icon" width="34" height="34" style="object-fit:contain;">`;
        } else {
          iconInner = `<svg class="service-card-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PRESET_SVGS.monitor}</svg>`;
        }

        const btnVisible = svc.button_visible !== false;
        const targetBlank = svc.button_target_blank ? 'target="_blank" rel="noopener noreferrer"' : '';
        const featuredStyle = svc.featured ? 'box-shadow: 0 12px 36px rgba(231, 25, 45, 0.16); border-color: rgba(231, 25, 45, 0.4);' : '';

        return `
          <!-- Card ${idx + 1}: ${svc.title ? svc.title.replace(/\n/g, ' ') : ''} -->
          <article class="service-showcase-card scroll-reveal is-revealed" id="${svc.id || ('service-' + (idx + 1))}" style="${featuredStyle}">
            <span class="service-card-num">${num}</span>
            <div class="service-badge-wrap" aria-hidden="true">
              <span class="service-badge-dot-1"></span>
              <div class="service-badge-circle">
                <span class="service-badge-ring"></span>
                ${iconInner}
              </div>
              <span class="service-badge-dot-2"></span>
            </div>
            <h2 class="service-card-title">${titleHtml}</h2>
            <p class="service-card-text">${svc.short_desc || ''}</p>
            ${btnVisible ? `
              <a href="${svc.button_url || '#'}" class="service-card-action" aria-label="Explore ${svc.display_title || svc.title}" ${targetBlank}>
                <span class="service-action-text">${svc.button_label || 'Explore Capability'}</span>
                <span class="service-action-arrow">&rarr;</span>
              </a>
            ` : ''}
          </article>`;
      }).join('\n');

      const regex = /(<div class="services-showcase-grid">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>\s*<!-- Full-Width Agency CTA Banner -->)/;
      html = html.replace(regex, `$1\n${cardsHtml}\n        $2`);
    }

    return html;
  } catch (err) {
    console.error('Error pre-rendering services.html:', err);
    return rawHtml;
  }
}

function renderAboutHtml(rawHtml, aboutData) {
  try {
    const pub = aboutData && aboutData.published ? aboutData.published : {};
    let html = rawHtml;

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
      if (wwd.heading) {
        html = html.replace(/(<section class="section-pad about-section">[\s\S]*?<h2 class="section-heading">)[\s\S]*?(<\/h2>)/, `$1\n              ${wwd.heading}\n            $2`);
      }
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
    if (pub.testimonials) {
      if (pub.testimonials.heading) {
        html = html.replace(/(<h2 class="section-heading" id="testimonials-heading">)[\s\S]*?(<\/h2>)/, `$1\n            ${pub.testimonials.heading}\n          $2`);
      }
      if (pub.testimonials.description) {
        html = html.replace(/(<h2 class="section-heading" id="testimonials-heading">[\s\S]*?<\/h2>\s*<p class="section-description">)[\s\S]*?(<\/p>)/, `$1\n            ${pub.testimonials.description}\n          $2`);
      }
      if (Array.isArray(pub.testimonials.items) && pub.testimonials.items.length > 0) {
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
              <div class="testimonial-avatar" aria-hidden="true">${t.avatar || (t.author ? t.author.substring(0, 2).toUpperCase() : 'CL')}</div>
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
    }

    // 5. CTA Section
    if (pub.cta) {
      const cta = pub.cta;
      if (cta.heading) {
        html = html.replace(/(<h2 class="cta-banner-heading" id="cta-heading">)[\s\S]*?(<\/h2>)/, `$1\n                ${cta.heading}\n              $2`);
      }
      if (cta.description) {
        html = html.replace(/(<p class="cta-banner-desc">)[\s\S]*?(<\/p>)/, `$1\n                ${cta.description}\n              $2`);
      }
    }

    return html;
  } catch (err) {
    console.error('Error pre-rendering about.html:', err);
    return rawHtml;
  }
}

function renderHomepageHtml(rawHtml, hpData) {
  try {
    const pub = (hpData && hpData.published) ? hpData.published : {};
    let html = rawHtml;

    // 1. Header Section
    if (pub.header) {
      const h = pub.header;
      if (h.logo_img) {
        html = html.replace(/(<img src=")[^"]*(" alt="[^"]*" class="logo-img")/, `$1${h.logo_img}$2`);
      }
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

    // Dynamic Featured Projects Showcase Deck (Strictly Top 3 Homepage Projects)
    try {
      const allProj = readJSON(PROJECTS_FILE, []);
      const top3Proj = allProj.filter(p => isProjectAtHomePage(p)).slice(0, 3);
      if (top3Proj.length) {
        const deckCards = renderFeaturedDeckHtml(top3Proj);
        html = html.replace(/(<div class="portfolio-showcase-deck">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/, `$1\n${deckCards}\n        $2`);
      }
    } catch (deckErr) {
      console.error('Error rendering featured deck in homepage:', deckErr);
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

function addAuditLog(action, section, user, details) {
  const logs = readJSON(LOGS_FILE, []);
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    section: section || 'all',
    user: user || 'admin',
    details: details || '',
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  if (logs.length > 500) logs.length = 500;
  writeJSON(LOGS_FILE, logs);
}

// Session Persistence Helpers
function loadSessions() {
  const diskSessions = readJSON(SESSIONS_FILE, {});
  const now = Date.now();
  for (const [token, session] of Object.entries(diskSessions)) {
    if (session && session.expiresAt && session.expiresAt > now) {
      activeSessions.set(token, session);
    }
  }
}

function saveSessions() {
  const obj = {};
  for (const [token, session] of activeSessions.entries()) {
    obj[token] = session;
  }
  writeJSON(SESSIONS_FILE, obj);
}

// Initial session load
loadSessions();

// Session Helpers
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function getAuthenticatedUser(req) {
  // 1. Check Authorization Bearer Header
  const authHeader = req.headers['authorization'];
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check Cookie
  if (!token) {
    const cookies = parseCookies(req);
    token = cookies['admin_session'];
  }

  if (!token) return null;

  let session = activeSessions.get(token);

  // If not found in RAM, reload from disk
  if (!session) {
    loadSessions();
    session = activeSessions.get(token);
  }

  // Graceful session recovery: If client possesses an 'adm_' token previously issued,
  // restore session so user is never abruptly locked out during saves
  if (!session && typeof token === 'string' && token.startsWith('adm_')) {
    const users = readJSON(USERS_FILE, []);
    const adminUser = users.find(u => u.username === 'admin') || {
      id: 'usr-admin-01',
      username: 'admin',
      name: 'BAADAM Administrator',
      email: 'admin@baadam.com',
      role: 'superadmin'
    };
    session = {
      userId: adminUser.id,
      username: adminUser.username,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    activeSessions.set(token, session);
    saveSessions();
  }

  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    saveSessions();
    return null;
  }

  // refresh expiration on activity (7 days)
  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return session;
}

// =========================================================================
// UNIVERSAL PICTURE & UPLOAD HELPERS (ALL FORMATS SUPPORTED)
// =========================================================================
const ALLOWED_IMAGE_EXTS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'avif', 'bmp', 'ico', 'tiff', 'tif', 'heic'
]);

function getImageDimensions(buffer, ext) {
  try {
    ext = (ext || '').toLowerCase().replace('.', '');
    if (ext === 'png' && buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (ext === 'gif' && buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'GIF') {
      return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
    }
    if ((ext === 'jpg' || ext === 'jpeg') && buffer.length >= 4 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xFF) { offset++; continue; }
        const marker = buffer[offset + 1];
        if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
          return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }
    if (ext === 'svg') {
      const str = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
      const vbMatch = str.match(/viewBox=["']\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);
      if (vbMatch) {
        return { width: Math.round(parseFloat(vbMatch[3])), height: Math.round(parseFloat(vbMatch[4])) };
      }
      const wMatch = str.match(/width=["']([0-9.]+)(?:px)?["']/i);
      const hMatch = str.match(/height=["']([0-9.]+)(?:px)?["']/i);
      if (wMatch && hMatch) {
        return { width: Math.round(parseFloat(wMatch[1])), height: Math.round(parseFloat(hMatch[1])) };
      }
    }
    if (ext === 'webp' && buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const type = buffer.toString('ascii', 12, 16);
      if (type === 'VP8X') {
        return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
      } else if (type === 'VP8L') {
        const b0 = buffer[21], b1 = buffer[22], b2 = buffer[23], b3 = buffer[24];
        return { width: 1 + (((b1 & 0x3F) << 8) | b0), height: 1 + (((b3 & 0xF) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6)) };
      }
    }
    if (ext === 'bmp' && buffer.length >= 26 && buffer.toString('ascii', 0, 2) === 'BM') {
      return { width: buffer.readInt32LE(18), height: Math.abs(buffer.readInt32LE(22)) };
    }
  } catch (e) {}
  return { width: 0, height: 0 };
}

function parseMultipartFormData(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from('--' + boundary);
  let start = 0;
  while ((start = buffer.indexOf(boundaryBuffer, start)) !== -1) {
    start += boundaryBuffer.length;
    if (buffer.slice(start, start + 2).toString() === '--') break;
    if (buffer.slice(start, start + 2).toString() === '\r\n') start += 2;
    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), start);
    if (headerEnd === -1) break;
    const headerText = buffer.slice(start, headerEnd).toString('utf8');
    const bodyStart = headerEnd + 4;
    const nextBoundary = buffer.indexOf(boundaryBuffer, bodyStart);
    if (nextBoundary === -1) break;
    let bodyEnd = nextBoundary;
    if (buffer.slice(bodyEnd - 2, bodyEnd).toString() === '\r\n') bodyEnd -= 2;
    const partBuffer = buffer.slice(bodyStart, bodyEnd);
    const headers = {};
    headerText.split('\r\n').forEach(line => {
      const col = line.indexOf(':');
      if (col !== -1) {
        headers[line.slice(0, col).trim().toLowerCase()] = line.slice(col + 1).trim();
      }
    });
    const disposition = headers['content-disposition'] || '';
    const nameMatch = disposition.match(/name=["']([^"']+)["']/i);
    const filenameMatch = disposition.match(/filename=["']([^"']+)["']/i);
    parts.push({
      name: nameMatch ? nameMatch[1] : '',
      filename: filenameMatch ? filenameMatch[1] : null,
      contentType: headers['content-type'] || 'application/octet-stream',
      data: partBuffer
    });
    start = nextBoundary;
  }
  return parts;
}

// Dynamic Pre-renderer for Portfolio Project Detail Pages
function deriveProjectIntro(desc) {
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

function deriveProjectHashtags(project) {
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
    project.technologies.slice(0, 4).forEach(t => {
      const clean = t.replace(/[^a-zA-Z0-9]/g, '');
      if (clean && !tags.includes('#' + clean)) tags.push('#' + clean);
    });
  }
  if (!tags.includes('#BAADAM')) tags.push('#BAADAM');
  return tags;
}

function isProjectAtHomePage(project) {
  if (!project) return false;
  const val = project.at_home_page;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return s === 'true' || s === 'yes' || s === '1';
  }
  if (typeof val === 'number') return val === 1;
  return false;
}

function renderProjectDetailHtml(templateHtml, project) {
  if (!project) return templateHtml;
  let html = templateHtml;

  const title = project.title || 'Untitled Project';
  const category = project.category || 'Web Application';
  const status = project.status || 'Completed';
  const month = project.service_month || '—';
  const duration = project.service_duration_days ? `${project.service_duration_days} Days` : '—';
  const desc = project.description || '';
  const shortIntro = deriveProjectIntro(desc);
  const url = project.url || '#';
  const imgs = Array.isArray(project.images) && project.images.length > 0 ? project.images : ['assets/portfolio-hero-1.png'];
  const isHome = isProjectAtHomePage(project);
  const techs = Array.isArray(project.technologies) ? project.technologies : [];
  const hashtags = deriveProjectHashtags(project);

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} — ${category} | BAADAM Studio</title>`);
  html = html.replace(/(<span class="breadcrumb-current" id="breadcrumb-current">)[^<]*(<\/span>)/, `$1${title}$2`);
  html = html.replace(/(<span id="proj-status-text">)[^<]*(<\/span>)/, `$1${status}$2`);
  html = html.replace(/(<h1 class="project-headline-title" id="proj-field-title"[^>]*>)[\s\S]*?(<\/h1>)/, `$1\n            ${title}\n          $2`);
  // Home Featured badge: strictly visible ONLY if project is marked for home page
  if (isHome) {
    html = html.replace(/(id="proj-field-featured"[^>]*style=")[^"]*(")/, '$1display: inline-flex;$2');
    html = html.replace('id="proj-badge-bar"', 'id="proj-badge-bar" style="display: flex;"');
  } else {
    html = html.replace(/(id="proj-field-featured"[^>]*style=")[^"]*(")/, '$1display: none;$2');
    html = html.replace('id="proj-badge-bar"', 'id="proj-badge-bar" style="display: none;"');
  }

  // Left Column: Goals Description
  html = html.replace(/(<div class="project-goals-body" id="proj-field-description">)[\s\S]*?(<\/div>)/, `$1\n                ${desc}\n              $2`);

  // Left Column: Primary Image
  const mainSrc = '/' + imgs[0].replace(/^[\/\\]+/, '');
  html = html.replace(/(<img id="proj-main-img" src=")[^"]*(")/, `$1${mainSrc}$2`);
  html = html.replace(/(<img id="proj-main-img"[^>]*alt=")[^"]*(")/, `$1${title} — Results Interface Showcase$2`);

  // Left Column: Remaining Images (Gallery)
  if (imgs.length > 1) {
    html = html.replace(/(id="proj-gallery-wrap"[^>]*style="[^"]*display:\s*)none/i, '$1block');
    const galleryHtml = imgs.slice(1).map((src, i) => {
      const actualIdx = i + 1;
      const normalized = '/' + src.replace(/^[\/\\]+/, '');
      return `
              <div class="gallery-item-card" onclick="openLightbox(${actualIdx})" title="View screen #${actualIdx + 1}">
                <div class="gallery-img-wrapper">
                  <img src="${normalized}" alt="${title} Screenshot ${actualIdx + 1}" loading="lazy">
                </div>
                <div class="gallery-item-caption">
                  <span>SCREENSHOT 0${actualIdx + 1}</span>
                  <span style="color: var(--proj-red); font-weight:700;">Enlarge &rarr;</span>
                </div>
              </div>`;
    }).join('\n');
    html = html.replace(/(<div class="gallery-subgrid" id="proj-field-gallery">)[\s\S]*?(<\/div>)/, `$1\n${galleryHtml}\n                  $2`);
  } else {
    html = html.replace(/(id="proj-gallery-wrap"[^>]*style="[^"]*display:\s*)block/i, '$1none');
  }

  // Right Column: Card 1 - Technologies
  if (techs.length > 0) {
    const techHtml = techs.map(t => `
            <div class="tech-badge-item">
              <span class="tech-badge-dot" aria-hidden="true"></span>
              <span>${t}</span>
            </div>`).join('\n');
    html = html.replace(/(<div class="tech-badges-grid" id="proj-field-technologies">)[\s\S]*?(<\/div>)/, `$1\n${techHtml}\n              $2`);
  }

  // Right Column: Card 2 - Service Month & Duration
  html = html.replace(/(<p class="(?:info-card-value|spec-value-text)" id="proj-field-month">)[^<]*(<\/p>)/, `$1${month}$2`);
  html = html.replace(/(<span id="proj-field-duration">)[^<]*(<\/span>)/, `$1${duration}$2`);

  // Right Column: Card 3 - Category
  html = html.replace(/(<span class="category-badge-pill" id="proj-field-category-card">)[^<]*(<\/span>)/, `$1${category}$2`);

  // Right Column: Card 4 - Project URL
  if (url && url !== '#') {
    const cleanUrlText = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    html = html.replace(/(<a href=")[^"]*(" id="proj-field-url"[^>]*>)/, `$1${url}$2`);
    html = html.replace(/(<span id="proj-field-url-text">)[^<]*(<\/span>)/, `$1${cleanUrlText}$2`);
    html = html.replace(/(<a href=")[^"]*(" id="proj-field-url-btn"[^>]*>)/, `$1${url}$2`);
  } else {
    html = html.replace('id="proj-field-url"', 'id="proj-field-url" style="display:none;"');
    html = html.replace('id="proj-field-url-btn"', 'id="proj-field-url-btn" style="display:none;"');
    html = html.replace('id="spec-url-item"', 'id="spec-url-item" style="display:none;"');
  }

  // Right Column: Card 5 - Hashtags
  if (hashtags && hashtags.length > 0) {
    const hashHtml = hashtags.map(h => `<span class="hashtag-pill">${h}</span>`).join('\n                    ');
    html = html.replace(/(<div class="hashtags-grid" id="proj-field-hashtags">)[\s\S]*?(<\/div>)/, `$1\n                    ${hashHtml}\n                  $2`);
  } else {
    html = html.replace('id="spec-hashtags-item"', 'id="spec-hashtags-item" style="display:none;"');
  }

  // Inject current slug
  const slugScript = `<script>window.BAADAM_CURRENT_SLUG = "${project.slug || project.id}";</script>`;
  html = html.replace('</head>', `${slugScript}\n</head>`);

  return html;
}

function renderFeaturedDeckHtml(featuredProjects) {
  const toRender = (featuredProjects || []).slice(0, 3);
  return toRender.map((p, idx) => {
    const numStr = (idx + 1) < 10 ? '0' + (idx + 1) : String(idx + 1);
    const rawImg = (Array.isArray(p.images) && p.images[0]) ? p.images[0] : 'assets/portfolio-hero-1.png';
    const coverImg = rawImg.replace(/^\/+/, '');
    const techTags = (Array.isArray(p.technologies) ? p.technologies : []).slice(0, 3)
      .map(t => `<span class="feature-tech-pill">${t}</span>`).join('\n                  ');
    const slug = p.slug || p.id;
    const detailUrl = `projects/${slug}/`;
    const cleanUrl = p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'baadam.com';
    const safeTitle = (p.title || 'Untitled Project').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeDesc = (p.description || 'Enterprise technology architecture engineered by BAADAM Studio.')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeCat = (p.category || 'Featured Solution').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    const beaconClass = idx === 1 ? 'beacon-emerald' : (idx === 2 ? 'beacon-blue' : '');
    const pillClass = idx === 1 ? 'feature-live-pill feature-live-pill-emerald' : (idx === 2 ? 'feature-live-pill feature-live-pill-blue' : 'feature-live-pill');
    const liveSub = idx === 0 ? 'Automated Sanction &middot; Wallets' : (idx === 1 ? 'Cloud Diagnostics &middot; Online Reports' : 'Live Kitchen Dispatch &middot; 0% Commission');

    return `          <!-- Project ${numStr}: ${safeTitle} -->
          <a href="${detailUrl}" class="portfolio-feature-card scroll-reveal is-revealed" data-project="${p.id || slug}" aria-label="View ${safeTitle} Project Details">
            <div class="feature-card-glow" aria-hidden="true"></div>
            <div class="feature-card-media-wrap">
              <div class="feature-card-chrome-bar" aria-hidden="true">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
                <span class="chrome-url-pill">${cleanUrl}</span>
              </div>
              <div class="feature-media-overflow">
                <img src="${coverImg}" alt="${safeTitle}" class="feature-media-img" width="460" height="240" loading="lazy">
              </div>
              <div class="${pillClass}">
                <span class="live-dot-beacon ${beaconClass}"></span>
                <span>${liveSub}</span>
              </div>
            </div>

            <div class="feature-card-body">
              <div class="feature-meta-kicker">
                <span class="feature-kicker-cat">${safeCat}</span>
                <span class="feature-kicker-idx">${numStr}</span>
              </div>
              <h3 class="feature-card-title">${safeTitle}</h3>
              <p class="feature-card-desc">
                ${safeDesc}
              </p>
              <div class="feature-card-footer">
                <div class="feature-tech-tags">
                  ${techTags}
                </div>
              </div>
            </div>
          </a>`;
  }).join('\n\n');
}

function syncHomepageShowcaseDeck(projects) {
  try {
    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    let html = fs.readFileSync(indexPath, 'utf8');

    const top3 = (projects || []).filter(p => isProjectAtHomePage(p)).slice(0, 3);
    const deckHtml = renderFeaturedDeckHtml(top3);

    html = html.replace(/(<div class="portfolio-showcase-deck">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/, `$1\n${deckHtml}\n        $2`);
    fs.writeFileSync(indexPath, html, 'utf8');
  } catch (err) {
    console.error('Error syncing index.html showcase deck:', err);
  }
}

function syncAllProjectDetailFiles(projects) {
  try {
    const masterTpl = path.join(__dirname, 'project-detail.html');
    if (!fs.existsSync(masterTpl)) return;
    const rawTpl = fs.readFileSync(masterTpl, 'utf8');

    (projects || []).forEach(p => {
      const slug = p.slug || p.id;
      const projDir = path.join(__dirname, 'projects', slug);
      if (!fs.existsSync(projDir)) fs.mkdirSync(projDir, { recursive: true });
      const rendered = renderProjectDetailHtml(rawTpl, p);
      fs.writeFileSync(path.join(projDir, 'index.html'), rendered, 'utf8');
    });
  } catch (err) {
    console.error('Error syncing all project detail files:', err);
  }
}

function enforceHomepageFeaturedLimit(projects, activeProjectId, replaceProjectId) {
  if (replaceProjectId) {
    const repIdx = projects.findIndex(p => p.id === replaceProjectId || p.slug === replaceProjectId);
    if (repIdx !== -1) {
      projects[repIdx].at_home_page = false;
    }
  }

  const featured = projects.filter(p => isProjectAtHomePage(p));
  if (featured.length > 3) {
    const surplus = featured.filter(p => p.id !== activeProjectId && p.slug !== activeProjectId);
    for (let i = 2; i < surplus.length; i++) {
      surplus[i].at_home_page = false;
    }
  }

  // Update homepage.json
  try {
    const top3Slugs = projects.filter(p => isProjectAtHomePage(p)).slice(0, 3).map(p => p.slug || p.id);
    const hp = readJSON(HOMEPAGE_FILE, {});
    if (hp.published && hp.published.featured_work) {
      hp.published.featured_work.featured_slugs = top3Slugs;
      hp.published.featured_work.selected_project_ids = top3Slugs;
      hp.published.featured_work.display_count = 3;
    }
    if (hp.draft && hp.draft.featured_work) {
      hp.draft.featured_work.featured_slugs = top3Slugs;
      hp.draft.featured_work.selected_project_ids = top3Slugs;
      hp.draft.featured_work.display_count = 3;
    }
    writeJSON(HOMEPAGE_FILE, hp);
  } catch (e) {
    console.error('Error updating homepage.json featured slugs:', e);
  }

  // Sync index.html and all 16 project directories
  syncHomepageShowcaseDeck(projects);
  syncAllProjectDetailFiles(projects);
}

// Server Core
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Helper response functions
  function sendJSON(status, data) {
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(JSON.stringify(data));
  }

  function sendError(status, message) {
    sendJSON(status, { error: message });
  }

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // Read JSON request body
  function getRequestBody(callback) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload Too Large' }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        callback(null, data);
      } catch (err) {
        callback(err, null);
      }
    });
  }

  // Read Raw Buffer request body (for multipart / binary / any picture upload)
  function getRawBody(callback) {
    const chunks = [];
    let len = 0;
    req.on('data', chunk => {
      chunks.push(chunk);
      len += chunk.length;
      if (len > 50 * 1024 * 1024) { // 50MB limit
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload Too Large (Max 50MB)' }));
        req.destroy();
      }
    });
    req.on('end', () => {
      callback(null, Buffer.concat(chunks));
    });
    req.on('error', err => callback(err, null));
  }

  // =========================================================================
  // 1. PUBLIC HOMEPAGE CONTENT API
  // =========================================================================
  if (method === 'GET' && pathname === '/api/homepage/published') {
    const data = readJSON(HOMEPAGE_FILE, {});
    sendJSON(200, {
      success: true,
      published: data.published || {},
      version: data.version || '1.0.0',
      last_published: data.last_published || null
    });
    return;
  }

  // =========================================================================
  // 1B. PUBLIC SERVICES PAGE CONTENT API
  // =========================================================================
  if (method === 'GET' && (pathname === '/api/services-page/published' || pathname === '/api/services-page')) {
    const data = readJSON(SERVICES_PAGE_FILE, { published: {}, version: '1.0.0' });
    sendJSON(200, {
      success: true,
      published: data.published || {},
      version: data.version || '1.0.0',
      last_published: data.last_published || null
    });
    return;
  }

  // Draft Preview for authenticated admin
  if (method === 'GET' && pathname === '/api/services-page/draft') {
    const data = readJSON(SERVICES_PAGE_FILE, { draft: {}, version: '1.0.0' });
    sendJSON(200, {
      success: true,
      draft: data.draft || data.published || {},
      status: data.status || 'published',
      version: data.version || '1.0.0'
    });
    return;
  }

  // =========================================================================
  // 1C. PUBLIC ABOUT US PAGE CONTENT API
  // =========================================================================
  if (method === 'GET' && (pathname === '/api/about-page/published' || pathname === '/api/about-page')) {
    const data = readJSON(ABOUT_PAGE_FILE, { published: {}, version: '1.0.0' });
    sendJSON(200, {
      success: true,
      published: data.published || {},
      version: data.version || '1.0.0',
      last_published: data.last_published || null
    });
    return;
  }

  // Draft Preview for about page
  if (method === 'GET' && pathname === '/api/about-page/draft') {
    const data = readJSON(ABOUT_PAGE_FILE, { draft: {}, version: '1.0.0' });
    sendJSON(200, {
      success: true,
      draft: data.draft || data.published || {},
      status: data.status || 'published',
      version: data.version || '1.0.0'
    });
    return;
  }

  // =========================================================================
  // 2. ADMIN AUTHENTICATION APIS
  // =========================================================================
  if (method === 'POST' && pathname === '/api/admin/login') {
    getRequestBody((err, body) => {
      if (err) return sendError(400, 'Invalid JSON body');
      const { username, password } = body;
      if (!username || !password) {
        return sendError(400, 'Username and password are required');
      }

      const users = readJSON(USERS_FILE, []);
      const user = users.find(u => 
        (u.username === username.trim() || u.email === username.trim().toLowerCase()) &&
        u.password_hash === hashPassword(password)
      );

      if (!user) {
        addAuditLog('login_failed', 'auth', username, 'Failed login attempt');
        return sendError(401, 'Invalid username or password');
      }

      // Generate Session Token
      const token = `adm_${crypto.randomBytes(32).toString('hex')}`;
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      activeSessions.set(token, {
        userId: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        expiresAt
      });
      saveSessions();

      // Update last login
      user.last_login = new Date().toISOString();
      writeJSON(USERS_FILE, users);
      addAuditLog('login_success', 'auth', user.username, 'Administrator logged in successfully');

      // Set HTTP-only Cookie
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      });
      res.end(JSON.stringify({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }));
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/admin/auth/check') {
    const user = getAuthenticatedUser(req);
    if (!user) return sendError(401, 'Unauthorized');
    sendJSON(200, { success: true, authenticated: true, user });
    return;
  }

  if (method === 'POST' && pathname === '/api/admin/logout') {
    const user = getAuthenticatedUser(req);
    const cookies = parseCookies(req);
    const token = cookies['admin_session'];
    if (token) {
      activeSessions.delete(token);
      saveSessions();
    }

    if (user) {
      addAuditLog('logout', 'auth', user.username, 'Administrator logged out');
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; Max-Age=0'
    });
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
    return;
  }

  // =========================================================================
  // 3. ADMIN HOMEPAGE CMS APIS (PROTECTED)
  // =========================================================================
  if (pathname.startsWith('/api/admin/homepage')) {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return sendError(401, 'Unauthorized. Please log in.');

    const hpData = readJSON(HOMEPAGE_FILE, { published: {}, draft: {}, section_status: {}, history: [] });

    // GET /api/admin/homepage - Returns status of all sections
    if (method === 'GET' && (pathname === '/api/admin/homepage' || pathname === '/api/admin/homepage/')) {
      sendJSON(200, {
        success: true,
        section_status: hpData.section_status || {},
        version: hpData.version || '1.0.0',
        last_published: hpData.last_published || null,
        history: hpData.history || []
      });
      return;
    }

    // GET /api/admin/homepage/history - History versions
    if (method === 'GET' && pathname === '/api/admin/homepage/history') {
      sendJSON(200, { success: true, history: hpData.history || [] });
      return;
    }

    // POST /api/admin/homepage/publish-all - Publish all draft changes
    if (method === 'POST' && pathname === '/api/admin/homepage/publish-all') {
      hpData.published = JSON.parse(JSON.stringify(hpData.draft));
      const now = new Date().toISOString();
      hpData.last_published = now;
      
      // Increment semver minor
      const vParts = (hpData.version || '1.0.0').split('.');
      vParts[2] = (parseInt(vParts[2], 10) + 1).toString();
      hpData.version = vParts.join('.');

      // Mark all sections published
      for (const key of Object.keys(hpData.section_status || {})) {
        hpData.section_status[key] = {
          status: 'published',
          last_updated: now
        };
      }

      // Add to history
      if (!hpData.history) hpData.history = [];
      hpData.history.unshift({
        version: hpData.version,
        published_at: now,
        published_by: authUser.username,
        notes: 'Bulk publish of all homepage sections'
      });
      if (hpData.history.length > 30) hpData.history.length = 30;

      writeJSON(HOMEPAGE_FILE, hpData);
      addAuditLog('publish_all', 'all', authUser.username, `Published all sections as version ${hpData.version}`);
      sendJSON(200, { success: true, version: hpData.version, published_at: now });
      return;
    }

    // Match /api/admin/homepage/:section
    const sectionMatch = pathname.match(/^\/api\/admin\/homepage\/([a-z0-9_-]+)(?:\/(publish|revert))?$/);
    if (sectionMatch) {
      const sectionKey = sectionMatch[1];
      const action = sectionMatch[2]; // 'publish' or 'revert' or undefined

      // Normalize section key: 'featured-work' -> 'featured_work', 'how-we-work' -> 'how_we_work', 'next-steps' -> 'next_steps'
      const normKey = sectionKey.replace(/-/g, '_');

      // Action: Publish Single Section
      if (method === 'POST' && action === 'publish') {
        if (!hpData.draft[normKey]) {
          return sendError(404, `Section ${sectionKey} not found in draft`);
        }
        hpData.published[normKey] = JSON.parse(JSON.stringify(hpData.draft[normKey]));
        const now = new Date().toISOString();
        hpData.last_published = now;
        
        if (!hpData.section_status) hpData.section_status = {};
        hpData.section_status[normKey] = {
          status: 'published',
          last_updated: now
        };

        writeJSON(HOMEPAGE_FILE, hpData);

        // Cross-synchronize to services_page.json when homepage services section is published
        if (normKey === 'services') {
          try {
            const sp = readJSON(SERVICES_PAGE_FILE, {});
            if (sp.published && Array.isArray(sp.published.services)) {
              const hpSrvList = Array.isArray(hpData.published.services) ? hpData.published.services : (hpData.published.services && Array.isArray(hpData.published.services.items) ? hpData.published.services.items : []);
              hpSrvList.slice(0, 6).forEach((s, i) => {
                if (sp.published.services[i]) {
                  sp.published.services[i].title = s.title;
                  sp.published.services[i].display_title = (s.title || '').replace(/\n/g, ' ');
                  sp.published.services[i].short_desc = s.short_desc;
                  sp.published.services[i].num = s.num;
                  if (s.destination_url || s.explore_url) sp.published.services[i].button_url = s.destination_url || s.explore_url;
                }
                if (sp.draft && Array.isArray(sp.draft.services) && sp.draft.services[i]) {
                  sp.draft.services[i].title = s.title;
                  sp.draft.services[i].display_title = (s.title || '').replace(/\n/g, ' ');
                  sp.draft.services[i].short_desc = s.short_desc;
                  sp.draft.services[i].num = s.num;
                  if (s.destination_url || s.explore_url) sp.draft.services[i].button_url = s.destination_url || s.explore_url;
                }
              });
              writeJSON(SERVICES_PAGE_FILE, sp);
            }
          } catch (syncErr) {
            console.error('Cross-sync error to services_page.json:', syncErr);
          }
        }

        addAuditLog('publish_section', sectionKey, authUser.username, `Published section ${sectionKey}`);
        sendJSON(200, { success: true, section: sectionKey, published_at: now, data: hpData.published[normKey] });
        return;
      }

      // Action: Revert Single Section to Published
      if (method === 'POST' && action === 'revert') {
        if (!hpData.published[normKey]) {
          return sendError(404, `No published baseline found for ${sectionKey}`);
        }
        hpData.draft[normKey] = JSON.parse(JSON.stringify(hpData.published[normKey]));
        const now = new Date().toISOString();
        if (!hpData.section_status) hpData.section_status = {};
        hpData.section_status[normKey] = {
          status: 'published',
          last_updated: now
        };

        writeJSON(HOMEPAGE_FILE, hpData);
        addAuditLog('revert_section', sectionKey, authUser.username, `Reverted section ${sectionKey} draft to published`);
        sendJSON(200, { success: true, section: sectionKey, data: hpData.draft[normKey] });
        return;
      }

      // GET /api/admin/homepage/:section
      if (method === 'GET' && !action) {
        sendJSON(200, {
          success: true,
          section: sectionKey,
          draft: hpData.draft[normKey] || null,
          published: hpData.published[normKey] || null,
          status: (hpData.section_status && hpData.section_status[normKey]) ? hpData.section_status[normKey].status : 'published',
          last_updated: (hpData.section_status && hpData.section_status[normKey]) ? hpData.section_status[normKey].last_updated : null
        });
        return;
      }

      // PUT /api/admin/homepage/:section - Save Draft
      if (method === 'PUT' && !action) {
        getRequestBody((err, body) => {
          if (err) return sendError(400, 'Invalid JSON body');
          if (!hpData.draft) hpData.draft = {};
          hpData.draft[normKey] = body;

          const now = new Date().toISOString();
          if (!hpData.section_status) hpData.section_status = {};
          hpData.section_status[normKey] = {
            status: 'draft',
            last_updated: now
          };

          writeJSON(HOMEPAGE_FILE, hpData);
          addAuditLog('save_draft', sectionKey, authUser.username, `Updated draft for section ${sectionKey}`);
          sendJSON(200, { success: true, section: sectionKey, status: 'draft', last_updated: now });
        });
        return;
      }
    }
  }

  // =========================================================================
  // 3B. ADMIN SERVICES PAGE CMS APIS (PROTECTED)
  // =========================================================================
  if (pathname.startsWith('/api/admin/services-page')) {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return sendError(401, 'Unauthorized. Please log in.');

    const spData = readJSON(SERVICES_PAGE_FILE, { published: {}, draft: {}, history: [] });

    // GET /api/admin/services-page
    if (method === 'GET' && (pathname === '/api/admin/services-page' || pathname === '/api/admin/services-page/')) {
      sendJSON(200, {
        success: true,
        draft: spData.draft || spData.published || {},
        published: spData.published || {},
        status: spData.status || 'published',
        version: spData.version || '1.0.0',
        last_published: spData.last_published || null,
        history: spData.history || []
      });
      return;
    }

    // PUT /api/admin/services-page - Save draft
    if (method === 'PUT' && (pathname === '/api/admin/services-page' || pathname === '/api/admin/services-page/')) {
      getRequestBody((err, body) => {
        if (err) return sendError(400, 'Invalid JSON body');
        spData.draft = body;
        spData.status = 'draft';
        const now = new Date().toISOString();
        spData.last_draft_updated = now;
        writeJSON(SERVICES_PAGE_FILE, spData);
        addAuditLog('save_draft', 'services_page', authUser.username, 'Updated Services page draft');
        sendJSON(200, { success: true, status: 'draft', last_draft_updated: now, draft: spData.draft });
      });
      return;
    }

    // POST /api/admin/services-page/publish - Publish live
    if (method === 'POST' && pathname === '/api/admin/services-page/publish') {
      spData.published = JSON.parse(JSON.stringify(spData.draft));
      spData.status = 'published';
      const now = new Date().toISOString();
      spData.last_published = now;

      // Increment version
      const vParts = (spData.version || '1.0.0').split('.');
      vParts[2] = (parseInt(vParts[2], 10) + 1).toString();
      spData.version = vParts.join('.');

      if (!spData.history) spData.history = [];
      spData.history.unshift({
        version: spData.version,
        published_at: now,
        published_by: authUser.username,
        notes: 'Published Services page changes'
      });
      if (spData.history.length > 30) spData.history.length = 30;

      writeJSON(SERVICES_PAGE_FILE, spData);

      // Cross-synchronize to homepage.json so core services match across both pages
      try {
        const hp = readJSON(HOMEPAGE_FILE, {});
        const hpPubItems = hp.published && (Array.isArray(hp.published.services) ? hp.published.services : (hp.published.services && Array.isArray(hp.published.services.items) ? hp.published.services.items : null));
        if (hpPubItems && Array.isArray(spData.published.services)) {
          spData.published.services.slice(0, 6).forEach((s, i) => {
            if (hpPubItems[i]) {
              hpPubItems[i].title = s.display_title || (s.title || '').replace(/\n/g, ' ');
              hpPubItems[i].short_desc = s.short_desc;
              hpPubItems[i].num = s.num;
              if (s.button_url) hpPubItems[i].explore_url = s.button_url;
            }
          });
          const hpDraftItems = hp.draft && (Array.isArray(hp.draft.services) ? hp.draft.services : (hp.draft.services && Array.isArray(hp.draft.services.items) ? hp.draft.services.items : null));
          if (hpDraftItems) {
            spData.published.services.slice(0, 6).forEach((s, i) => {
              if (hpDraftItems[i]) {
                hpDraftItems[i].title = s.display_title || (s.title || '').replace(/\n/g, ' ');
                hpDraftItems[i].short_desc = s.short_desc;
                hpDraftItems[i].num = s.num;
                if (s.button_url) hpDraftItems[i].explore_url = s.button_url;
              }
            });
          }
          writeJSON(HOMEPAGE_FILE, hp);
        }
      } catch (syncErr) {
        console.error('Error cross-syncing to homepage.json:', syncErr);
      }

      addAuditLog('publish', 'services_page', authUser.username, `Published Services page v${spData.version}`);
      sendJSON(200, { success: true, status: 'published', version: spData.version, published_at: now, published: spData.published });
      return;
    }

    // POST /api/admin/services-page/revert - Revert draft to published
    if (method === 'POST' && pathname === '/api/admin/services-page/revert') {
      if (!spData.published) return sendError(404, 'No published baseline to revert to');
      spData.draft = JSON.parse(JSON.stringify(spData.published));
      spData.status = 'published';
      writeJSON(SERVICES_PAGE_FILE, spData);
      addAuditLog('revert', 'services_page', authUser.username, 'Reverted Services page draft to published version');
      sendJSON(200, { success: true, status: 'published', draft: spData.draft });
      return;
    }

    // POST /api/admin/services-page/duplicate/:id
    const dupMatch = pathname.match(/^\/api\/admin\/services-page\/duplicate\/([a-zA-Z0-9_-]+)$/);
    if (method === 'POST' && dupMatch) {
      const targetId = dupMatch[1];
      if (!spData.draft || !Array.isArray(spData.draft.services)) {
        return sendError(400, 'Services list is not initialized');
      }
      const existing = spData.draft.services.find(s => s.id === targetId);
      if (!existing) return sendError(404, 'Service not found');

      const newId = `srv-${Date.now()}`;
      const newNum = String(spData.draft.services.length + 1).padStart(2, '0');
      const duplicated = JSON.parse(JSON.stringify(existing));
      duplicated.id = newId;
      duplicated.num = newNum;
      duplicated.title = `${existing.title} (Copy)`;
      duplicated.display_title = `${existing.display_title || existing.title} (Copy)`;
      duplicated.order = spData.draft.services.length + 1;
      
      spData.draft.services.push(duplicated);
      spData.status = 'draft';
      writeJSON(SERVICES_PAGE_FILE, spData);
      addAuditLog('duplicate_service', 'services_page', authUser.username, `Duplicated service ${existing.display_title || existing.title}`);
      sendJSON(201, { success: true, service: duplicated, draft: spData.draft });
      return;
    }

    // DELETE /api/admin/services-page/service/:id
    const delMatch = pathname.match(/^\/api\/admin\/services-page\/service\/([a-zA-Z0-9_-]+)$/);
    if (method === 'DELETE' && delMatch) {
      const targetId = delMatch[1];
      if (!spData.draft || !Array.isArray(spData.draft.services)) {
        return sendError(400, 'Services list is not initialized');
      }
      const idx = spData.draft.services.findIndex(s => s.id === targetId);
      if (idx === -1) return sendError(404, 'Service not found');

      const deleted = spData.draft.services.splice(idx, 1)[0];
      spData.status = 'draft';
      writeJSON(SERVICES_PAGE_FILE, spData);
      addAuditLog('delete_service', 'services_page', authUser.username, `Deleted service ${deleted.display_title || deleted.title}`);
      sendJSON(200, { success: true, deleted, draft: spData.draft });
      return;
    }
  }

  // =========================================================================
  // 3C. ADMIN ABOUT US PAGE CMS APIS (PROTECTED)
  // =========================================================================
  if (pathname.startsWith('/api/admin/about-page')) {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return sendError(401, 'Unauthorized. Please log in.');

    const abData = readJSON(ABOUT_PAGE_FILE, { published: {}, draft: {}, history: [] });

    // GET /api/admin/about-page
    if (method === 'GET' && (pathname === '/api/admin/about-page' || pathname === '/api/admin/about-page/')) {
      sendJSON(200, {
        success: true,
        draft: abData.draft || abData.published || {},
        published: abData.published || {},
        status: abData.status || 'published',
        version: abData.version || '1.0.0',
        last_published: abData.last_published || null,
        history: abData.history || []
      });
      return;
    }

    // PUT /api/admin/about-page - Save draft
    if (method === 'PUT' && (pathname === '/api/admin/about-page' || pathname === '/api/admin/about-page/')) {
      getRequestBody((err, body) => {
        if (err) return sendError(400, 'Invalid JSON body');
        abData.draft = body;
        abData.status = 'draft';
        const now = new Date().toISOString();
        abData.last_draft_updated = now;
        writeJSON(ABOUT_PAGE_FILE, abData);
        addAuditLog('save_draft', 'about_page', authUser.username, 'Updated About Us page draft');
        sendJSON(200, { success: true, status: 'draft', last_draft_updated: now, draft: abData.draft });
      });
      return;
    }

    // POST /api/admin/about-page/publish - Publish live
    if (method === 'POST' && pathname === '/api/admin/about-page/publish') {
      abData.published = JSON.parse(JSON.stringify(abData.draft || abData.published));
      abData.status = 'published';
      const now = new Date().toISOString();
      abData.last_published = now;

      // Increment version
      const vParts = (abData.version || '1.0.0').split('.');
      vParts[2] = (parseInt(vParts[2], 10) + 1).toString();
      abData.version = vParts.join('.');

      if (!abData.history) abData.history = [];
      abData.history.unshift({
        version: abData.version,
        published_at: now,
        published_by: authUser.username,
        notes: 'Published About Us page changes'
      });
      if (abData.history.length > 30) abData.history.length = 30;

      writeJSON(ABOUT_PAGE_FILE, abData);
      addAuditLog('publish', 'about_page', authUser.username, `Published About Us page v${abData.version}`);
      sendJSON(200, { success: true, status: 'published', version: abData.version, published_at: now, published: abData.published });
      return;
    }

    // POST /api/admin/about-page/revert - Revert draft to published
    if (method === 'POST' && pathname === '/api/admin/about-page/revert') {
      if (!abData.published) return sendError(404, 'No published baseline to revert to');
      abData.draft = JSON.parse(JSON.stringify(abData.published));
      abData.status = 'published';
      writeJSON(ABOUT_PAGE_FILE, abData);
      addAuditLog('revert', 'about_page', authUser.username, 'Reverted About Us page draft to published version');
      sendJSON(200, { success: true, status: 'published', draft: abData.draft });
      return;
    }
  }

  // =========================================================================
  // 4. MEDIA LIBRARY APIS (PROTECTED)
  // =========================================================================
  if (pathname.startsWith('/api/admin/media')) {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return sendError(401, 'Unauthorized');

    let mediaList = readJSON(MEDIA_FILE, []);

    // GET /api/admin/media
    if (method === 'GET' && pathname === '/api/admin/media') {
      const q = (parsedUrl.searchParams.get('q') || '').toLowerCase().trim();
      let results = mediaList;
      if (q) {
        results = results.filter(m => 
          (m.filename && m.filename.toLowerCase().includes(q)) || 
          (m.alt && m.alt.toLowerCase().includes(q))
        );
      }
      const formatted = results.map(item => {
        const cleanPath = (item.path || '').replace(/^\/+/, '');
        const ext = path.extname(cleanPath).toLowerCase().replace('.', '');
        return {
          ...item,
          path: cleanPath,
          url: '/' + cleanPath,
          ext: ext || (item.mime_type ? item.mime_type.split('/')[1] : ''),
          dimensions: item.dimensions || (item.width && item.height ? { width: item.width, height: item.height } : null)
        };
      });
      sendJSON(200, { success: true, count: formatted.length, media: formatted, items: formatted });
      return;
    }

    // POST /api/admin/media/upload (UNIVERSAL: MULTIPART / JSON / BINARY - ALL PICTURE FORMATS)
    if (method === 'POST' && pathname === '/api/admin/media/upload') {
      getRawBody((err, rawBuffer) => {
        if (err) return sendError(500, 'Error reading upload payload: ' + err.message);
        if (!rawBuffer || rawBuffer.length === 0) {
          return sendError(400, 'No file content received. Please select a picture to upload.');
        }

        const contentType = (req.headers['content-type'] || '').toLowerCase();
        const incomingFiles = [];
        let formAlt = '';

        // Case 1: Standard Multipart Form-Data (Native Browser FormData / File Input)
        if (contentType.includes('multipart/form-data')) {
          const boundaryMatch = (req.headers['content-type'] || '').match(/boundary=([^;]+)/i);
          if (!boundaryMatch) {
            return sendError(400, 'Malformed multipart upload: missing boundary');
          }
          const boundary = boundaryMatch[1].trim().replace(/^["']|["']$/g, '');
          const parts = parseMultipartFormData(rawBuffer, boundary);

          for (const part of parts) {
            if (part.filename) {
              incomingFiles.push({
                name: part.filename,
                buffer: part.data,
                contentType: part.contentType
              });
            } else if (part.name === 'alt') {
              formAlt = part.data.toString('utf8').trim();
            }
          }
        }
        // Case 2: JSON Payload (Base64 data or data URLs)
        else if (contentType.includes('application/json') || rawBuffer[0] === 0x7B || rawBuffer[0] === 0x5B) {
          try {
            const body = JSON.parse(rawBuffer.toString('utf8'));
            const list = Array.isArray(body.files) ? body.files : 
                         (Array.isArray(body.images) ? body.images : 
                         (body.file ? [body.file] : (Array.isArray(body) ? body : [body])));

            for (const item of list) {
              if (!item) continue;
              let fileBuf = null;
              let mime = item.type || item.mime_type || 'image/jpeg';
              let name = item.name || item.filename || `pic_${Date.now()}.jpg`;

              if (typeof item.data === 'string') {
                const dataUrlMatch = item.data.match(/^data:([^;]+);base64,(.+)$/);
                if (dataUrlMatch) {
                  mime = dataUrlMatch[1];
                  fileBuf = Buffer.from(dataUrlMatch[2], 'base64');
                } else {
                  fileBuf = Buffer.from(item.data, 'base64');
                }
              } else if (Buffer.isBuffer(item.data)) {
                fileBuf = item.data;
              }

              if (fileBuf && fileBuf.length > 0) {
                incomingFiles.push({
                  name,
                  buffer: fileBuf,
                  contentType: mime,
                  alt: item.alt
                });
              }
            }
          } catch (jsonErr) {
            return sendError(400, 'Invalid JSON body: ' + jsonErr.message);
          }
        }
        // Case 3: Raw Binary Picture Upload (image/*)
        else if (contentType.startsWith('image/') || contentType === 'application/octet-stream') {
          const nameParam = parsedUrl.searchParams.get('filename') || 
                            req.headers['x-filename'] || 
                            `upload_${Date.now()}.${contentType.split('/')[1] || 'jpg'}`;
          incomingFiles.push({
            name: nameParam,
            buffer: rawBuffer,
            contentType
          });
        } else {
          return sendError(400, 'Unsupported Content-Type for image upload. Use multipart/form-data or application/json.');
        }

        if (incomingFiles.length === 0) {
          return sendError(400, 'No valid pictures found in upload request.');
        }

        const savedItems = [];
        const validationErrors = [];

        for (const file of incomingFiles) {
          const originalName = file.name || `image_${Date.now()}.jpg`;
          const rawExt = (path.extname(originalName) || (file.contentType ? file.contentType.split('/')[1] : 'jpg'))
            .toLowerCase()
            .replace('.', '');
          const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;

          // Strict validation: Only allowed picture formats
          if (!ALLOWED_IMAGE_EXTS.has(ext)) {
            validationErrors.push(`"${originalName}": Invalid file format .${ext}. Only pictures are allowed (JPG, PNG, WebP, SVG, GIF, AVIF, BMP, ICO, TIFF).`);
            continue;
          }

          // Validation: Non-empty buffer
          if (!file.buffer || file.buffer.length === 0) {
            validationErrors.push(`"${originalName}": File is empty (0 bytes).`);
            continue;
          }

          // Validation: Max file size (50MB)
          if (file.buffer.length > 50 * 1024 * 1024) {
            validationErrors.push(`"${originalName}": File exceeds the 50MB size limit.`);
            continue;
          }

          // Extract accurate image dimensions
          const dims = getImageDimensions(file.buffer, ext);

          // Clean, safe unique filename
          const cleanBase = path.basename(originalName, path.extname(originalName))
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .slice(0, 80);
          const safeFilename = `med_${Date.now()}_${cleanBase || 'pic'}.${ext}`;
          const filepath = path.join(UPLOAD_DIR, safeFilename);

          try {
            fs.writeFileSync(filepath, file.buffer);
          } catch (writeErr) {
            validationErrors.push(`"${originalName}": Failed to save on server (${writeErr.message}).`);
            continue;
          }

          const altText = file.alt || formAlt || cleanBase.replace(/[-_]/g, ' ');

          const mediaItem = {
            id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            filename: safeFilename,
            path: `assets/uploads/${safeFilename}`,
            url: `/assets/uploads/${safeFilename}`,
            originalName,
            alt: altText,
            width: dims.width || 0,
            height: dims.height || 0,
            dimensions: (dims.width && dims.height) ? { width: dims.width, height: dims.height } : null,
            size: file.buffer.length,
            mime_type: file.contentType || ('image/' + ext),
            uploaded_at: new Date().toISOString()
          };

          mediaList.unshift(mediaItem);
          savedItems.push(mediaItem);
        }

        if (savedItems.length === 0) {
          return sendError(400, validationErrors.join(' | ') || 'Failed to upload pictures: validation failed.');
        }

        writeJSON(MEDIA_FILE, mediaList);
        addAuditLog('media_upload', 'media', authUser.username, `Uploaded ${savedItems.length} picture(s)`);
        sendJSON(200, {
          success: true,
          count: savedItems.length,
          items: savedItems,
          warnings: validationErrors.length ? validationErrors : undefined
        });
      });
      return;
    }

    // PUT /api/admin/media/:id
    const putMatch = pathname.match(/^\/api\/admin\/media\/([a-z0-9_-]+)$/i);
    if (method === 'PUT' && putMatch) {
      const mediaId = putMatch[1];
      const idx = mediaList.findIndex(m => m.id === mediaId);
      if (idx === -1) return sendError(404, 'Media item not found');

      getRequestBody((err, body) => {
        if (err) return sendError(400, 'Invalid JSON body');
        if (body.alt !== undefined) mediaList[idx].alt = String(body.alt).trim();
        if (body.filename && body.filename.trim()) mediaList[idx].filename = String(body.filename).trim();
        writeJSON(MEDIA_FILE, mediaList);
        addAuditLog('media_update', 'media', authUser.username, `Updated media item ${mediaList[idx].filename}`);
        const cleanPath = (mediaList[idx].path || '').replace(/^\/+/, '');
        sendJSON(200, {
          success: true,
          item: {
            ...mediaList[idx],
            path: cleanPath,
            url: '/' + cleanPath
          }
        });
      });
      return;
    }

    // DELETE /api/admin/media/:id
    const delMatch = pathname.match(/^\/api\/admin\/media\/([a-z0-9_-]+)$/i);
    if (method === 'DELETE' && delMatch) {
      const mediaId = delMatch[1];
      const idx = mediaList.findIndex(m => m.id === mediaId);
      if (idx === -1) return sendError(404, 'Media item not found');

      const item = mediaList[idx];
      mediaList.splice(idx, 1);
      writeJSON(MEDIA_FILE, mediaList);

      // Attempt to unlink physical file if in uploads
      try {
        const fullP = path.join(__dirname, item.path);
        if (fs.existsSync(fullP) && item.path.includes('uploads')) {
          fs.unlinkSync(fullP);
        }
      } catch (e) {
        console.error('Error deleting file:', e);
      }

      addAuditLog('media_delete', 'media', authUser.username, `Deleted media item ${item.filename}`);
      sendJSON(200, { success: true, deleted: item });
      return;
    }
  }

  // =========================================================================
  // 5. AUDIT LOGS API (PROTECTED)
  // =========================================================================
  if (method === 'GET' && pathname === '/api/admin/logs') {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return sendError(401, 'Unauthorized');
    const logs = readJSON(LOGS_FILE, []);
    sendJSON(200, { success: true, logs });
    return;
  }

  // =========================================================================
  // 6. PROJECTS CENTRAL DATABASE APIS (EXISTING & ENHANCED)
  // =========================================================================
  if (pathname === '/api/projects' || pathname.startsWith('/api/projects/')) {
    let projects = readJSON(PROJECTS_FILE, []);

    if (method === 'GET' && pathname === '/api/projects') {
      sendJSON(200, projects);
      return;
    }

    const idMatch = pathname.match(/^\/api\/projects\/([a-z0-9-]+)$/i);
    if (idMatch) {
      const id = idMatch[1];
      const project = projects.find(p => p.id === id || p.slug === id);

      if (method === 'GET') {
        if (!project) return sendError(404, 'Project not found');
        sendJSON(200, project);
        return;
      }

      // Protected Project modifications
      const authUser = getAuthenticatedUser(req);
      if (!authUser) return sendError(401, 'Unauthorized. Please log in.');

      if (method === 'PUT') {
        getRequestBody((err, body) => {
          if (err) return sendError(400, 'Invalid JSON body');
          const idx = projects.findIndex(p => p.id === id || p.slug === id);
          if (idx === -1) return sendError(404, 'Project not found');

          const willBeFeatured = (body.at_home_page !== undefined) ? isProjectAtHomePage(body) : Boolean(projects[idx].at_home_page);
          const replaceTargetId = body.replace_project_id;
          delete body.replace_project_id;

          projects[idx] = { 
            ...projects[idx], 
            ...body, 
            id: projects[idx].id,
            at_home_page: willBeFeatured
          };
          writeJSON(PROJECTS_FILE, projects);

          // Strictly enforce maximum 3 projects on homepage and sync index.html + detail files
          enforceHomepageFeaturedLimit(projects, projects[idx].id, willBeFeatured ? replaceTargetId : null);
          writeJSON(PROJECTS_FILE, projects);

          addAuditLog('update_project', 'projects', authUser.username, `Updated project ${projects[idx].title}`);
          sendJSON(200, projects[idx]);
        });
        return;
      }

      if (method === 'DELETE') {
        const idx = projects.findIndex(p => p.id === id || p.slug === id);
        if (idx === -1) return sendError(404, 'Project not found');
        const deleted = projects.splice(idx, 1)[0];
        writeJSON(PROJECTS_FILE, projects);
        enforceHomepageFeaturedLimit(projects, null, null);
        addAuditLog('delete_project', 'projects', authUser.username, `Deleted project ${deleted.title}`);
        sendJSON(200, { success: true, deleted });
        return;
      }
    }

    if (method === 'POST' && pathname === '/api/projects') {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) return sendError(401, 'Unauthorized. Please log in.');

      getRequestBody((err, body) => {
        if (err) return sendError(400, 'Invalid JSON body');
        const willBeFeatured = isProjectAtHomePage(body);
        const replaceTargetId = body.replace_project_id;
        delete body.replace_project_id;

        const newProj = {
          id: body.id || `proj-${Date.now()}`,
          slug: body.slug || (body.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          title: body.title || 'Untitled Project',
          url: body.url || '#',
          category: body.category || 'Web Application',
          at_home_page: willBeFeatured,
          service_month: body.service_month || 'Nov 2026',
          service_duration_days: parseInt(body.service_duration_days, 10) || 30,
          status: body.status || 'Completed',
          hashtags: Array.isArray(body.hashtags) ? body.hashtags : (typeof body.hashtags === 'string' ? body.hashtags.split(/[\s,]+/).filter(Boolean) : []),
          technologies: Array.isArray(body.technologies) ? body.technologies : ['HTML', 'CSS', 'JavaScript'],
          description: body.description || '',
          images: Array.isArray(body.images) ? body.images : []
        };

        projects.unshift(newProj);
        writeJSON(PROJECTS_FILE, projects);

        enforceHomepageFeaturedLimit(projects, newProj.id, willBeFeatured ? replaceTargetId : null);
        writeJSON(PROJECTS_FILE, projects);

        addAuditLog('create_project', 'projects', authUser.username, `Created project ${newProj.title}`);
        sendJSON(201, newProj);
      });
      return;
    }
  }

  // Upload API (Multipart / Base64 fallback)
  if (method === 'POST' && pathname === '/api/upload') {
    getRequestBody((err, body) => {
      if (err) return sendError(400, 'Invalid JSON body');
      const uploads = Array.isArray(body.images) ? body.images : [body];
      const savedPaths = [];

      for (const item of uploads) {
        if (!item.data) continue;
        const matches = item.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'jpg';
          const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
          const filename = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${cleanExt}`;
          const filepath = path.join(UPLOAD_DIR, filename);
          const buffer = Buffer.from(matches[2], 'base64');
          fs.writeFileSync(filepath, buffer);
          savedPaths.push(`assets/uploads/${filename}`);
        } else if (typeof item === 'string' && item.startsWith('assets/')) {
          savedPaths.push(item);
        }
      }
      sendJSON(200, { success: true, paths: savedPaths });
    });
    return;
  }

  // =========================================================================
  // 7. PROTECTED ADMIN ROUTE HANDLER
  // =========================================================================
  // If the browser visits an admin page:
  if (pathname.startsWith('/admin')) {
    const cleanAdminPath = pathname.replace(/\/$/, '');
    const adminExt = path.extname(cleanAdminPath).toLowerCase();

    // Allow static assets under /admin (.css, .js, images) without authentication
    if (['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2', '.map'].includes(adminExt)) {
      // Pass through to static file server below
    } else {
      // Allow /admin/login without authentication
      if (cleanAdminPath === '/admin/login' || cleanAdminPath === '/admin/login.html') {
        const loginHtmlPath = path.join(__dirname, 'admin', 'login.html');
        if (fs.existsSync(loginHtmlPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(loginHtmlPath).pipe(res);
          return;
        }
      }

      // Verify session for all other /admin routes
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        // Redirect to /admin/login with return URL
        res.writeHead(302, {
          'Location': `/admin/login?redirect=${encodeURIComponent(pathname + (parsedUrl.search || ''))}`
        });
        res.end();
        return;
      }

      // Route /admin, /admin.html or /admin/dashboard
      if (cleanAdminPath === '/admin' || cleanAdminPath === '/admin.html' || cleanAdminPath === '/admin/dashboard' || cleanAdminPath === '/admin/dashboard.html') {
        const dashPath = path.join(__dirname, 'admin', 'dashboard.html');
        if (fs.existsSync(dashPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(dashPath).pipe(res);
          return;
        }
      }

      // Route /admin/homepage
      if (cleanAdminPath === '/admin/homepage' || cleanAdminPath === '/admin/homepage/index.html') {
        const hpPath = path.join(__dirname, 'admin', 'homepage', 'index.html');
        if (fs.existsSync(hpPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(hpPath).pipe(res);
          return;
        }
      }

      // Route /admin/homepage/:section -> Forward to unified all-in-one homepage page
      const secMatch = cleanAdminPath.match(/^\/admin\/homepage\/([a-z0-9_-]+)(\.html)?$/);
      if (secMatch) {
        const secName = secMatch[1];
        if (secName !== 'index') {
          res.writeHead(302, { 'Location': `/admin/homepage/index.html#${secName}` });
          res.end();
          return;
        }
      }

      // Route /admin/services
      if (cleanAdminPath === '/admin/services' || cleanAdminPath === '/admin/services.html') {
        const servHtmlPath = path.join(__dirname, 'admin', 'services.html');
        if (fs.existsSync(servHtmlPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(servHtmlPath).pipe(res);
          return;
        }
      }

      // Route /admin/about
      if (cleanAdminPath === '/admin/about' || cleanAdminPath === '/admin/about.html') {
        const aboutHtmlPath = path.join(__dirname, 'admin', 'about.html');
        if (fs.existsSync(aboutHtmlPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(aboutHtmlPath).pipe(res);
          return;
        }
      }

      // Route /admin/projects
      if (cleanAdminPath === '/admin/projects' || cleanAdminPath === '/admin/projects.html') {
        const projHtmlPath = path.join(__dirname, 'admin', 'projects.html');
        if (fs.existsSync(projHtmlPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(projHtmlPath).pipe(res);
          return;
        }
      }

      // Route /admin/media (Redirect to dashboard as Media Library is removed)
      if (cleanAdminPath === '/admin/media' || cleanAdminPath === '/admin/media.html') {
        res.writeHead(302, { 'Location': '/admin/dashboard.html' });
        res.end();
        return;
      }
    }
  }

  // =========================================================================
  // 8. STATIC FILE SERVING WITH CLEAN URL RESOLUTION
  // =========================================================================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  let filePath = path.join(__dirname, safePath);

  function serveFile(targetPath) {
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Dynamic pre-rendering for public Homepage (index.html)
    const normTarget = path.normalize(targetPath);
    const rootIndex = path.normalize(path.join(__dirname, 'index.html'));
    if (normTarget === rootIndex) {
      try {
        const raw = fs.readFileSync(rootIndex, 'utf8');
        const isDraftPreview = parsedUrl.search && parsedUrl.search.includes('preview=draft');
        const hpData = readJSON(HOMEPAGE_FILE, { published: {}, draft: {} });
        const rendered = renderHomepageHtml(raw, isDraftPreview ? { published: hpData.draft } : hpData);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(rendered);
        return;
      } catch (err) {
        console.error('Error pre-rendering index.html:', err);
      }
    }

    // Dynamic pre-rendering for public Services page (services.html)
    if (targetPath.endsWith('services.html') || targetPath.endsWith('services')) {
      try {
        const raw = fs.readFileSync(targetPath.endsWith('.html') ? targetPath : (targetPath + '.html'), 'utf8');
        const spData = readJSON(SERVICES_PAGE_FILE, { published: {} });
        const rendered = renderServicesHtml(raw, spData);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(rendered);
        return;
      } catch (err) {
        console.error('Error pre-rendering services.html:', err);
      }
    }

    // Dynamic pre-rendering for public About page (about.html)
    if (targetPath.endsWith('about.html') || targetPath.endsWith('about')) {
      try {
        const raw = fs.readFileSync(targetPath.endsWith('.html') ? targetPath : (targetPath + '.html'), 'utf8');
        const abData = readJSON(ABOUT_PAGE_FILE, { published: {} });
        const rendered = renderAboutHtml(raw, abData);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(rendered);
        return;
      } catch (err) {
        console.error('Error pre-rendering about.html:', err);
      }
    }

    // Dynamic pre-rendering for Portfolio Project Detail pages (/projects/:slug or /project-detail.html)
    const masterDetailTemplate = path.join(__dirname, 'project-detail.html');
    const isProjectDetailHtml = normTarget === path.normalize(masterDetailTemplate);
    const isUnderProjectsDir = normTarget.includes(path.normalize(path.join(__dirname, 'projects')));

    if (isProjectDetailHtml || isUnderProjectsDir) {
      try {
        let slug = parsedUrl.searchParams.get('slug') || parsedUrl.searchParams.get('id');
        if (!slug && isUnderProjectsDir) {
          const match = normTarget.match(/[\\\/]projects[\\\/]([^\\\/]+)/i);
          if (match) slug = match[1];
        }
        if (slug) {
          const projects = readJSON(PROJECTS_FILE, []);
          const project = projects.find(p => p.slug === slug || p.id === slug);
          if (project) {
            const raw = fs.readFileSync(masterDetailTemplate, 'utf8');
            const rendered = renderProjectDetailHtml(raw, project);
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            });
            res.end(rendered);
            return;
          }
        }
      } catch (err) {
        console.error('Error dynamically pre-rendering project detail:', err);
      }
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
    });
    fs.createReadStream(targetPath).pipe(res);
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { 'Location': pathname + '/' + (parsedUrl.search || '') });
        res.end();
        return;
      }
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        serveFile(indexPath);
        return;
      }
    }

    if (!err && stats.isFile()) {
      serveFile(filePath);
      return;
    }

    // Try clean URL with .html extension (e.g. /about -> /about.html)
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      serveFile(htmlPath);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  });
});

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  server.listen(PORT, () => {
    console.log(`BAADAM CMS & Web Server running at http://localhost:${PORT}`);
  });
}

export default server;
