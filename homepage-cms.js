/**
 * BAADAM CMS - Dynamic Live Homepage Hydration
 * Fetches published CMS configuration from /api/homepage/published
 * and updates DOM elements smoothly without affecting animations or layouts.
 */

(function () {
  'use strict';

  async function initHomepageCMS() {
    try {
      const res = await fetch('/api/homepage/published?t=' + Date.now());
      if (!res.ok) return;
      const json = await res.json();
      const cms = json.published || json;
      if (!cms) return;

      // 1. Header & Navigation
      if (cms.header) {
        hydrateHeader(cms.header);
      }

      // 2. Hero Section
      if (cms.hero) {
        hydrateHero(cms.hero);
      }

      // 3. Client Radar Section
      if (cms.radar) {
        hydrateRadar(cms.radar);
      }

      // 4. Services Section
      if (cms.services) {
        hydrateServices(cms.services);
      }

      // 5. Featured Work Section
      const fwData = cms.featured_work || cms['featured-work'];
      if (fwData) {
        hydrateFeaturedWork(fwData);
      }

      // 6. Case Studies Section
      const csData = cms.case_studies || cms['case-studies'];
      if (csData) {
        hydrateCaseStudies(csData);
      }

      // 7. How We Work Section
      const hwwData = cms.how_we_work || cms['how-we-work'];
      if (hwwData) {
        hydrateHowWeWork(hwwData);
      }

      // 8. Next Steps / CTA Section
      const nsData = cms.next_steps || cms['next-steps'];
      if (nsData) {
        hydrateNextSteps(nsData);
      }

      // 9. Canonical Footer Section
      if (cms.footer) {
        hydrateFooter(cms.footer);
      }
    } catch (e) {
      console.warn('[BAADAM CMS] Could not hydrate homepage from CMS:', e);
    }
  }

  // 1. Header Hydration
  function hydrateHeader(h) {
    if (!h) return;

    // Logo image or text
    const logoImgs = document.querySelectorAll('.site-header .logo-img');
    if (h.logo_image && logoImgs.length) {
      logoImgs.forEach(img => { img.src = h.logo_image; });
    }

    // Let's talk button
    const talkBtn = document.querySelector('.site-header .btn-talk');
    if (talkBtn && h.cta_button) {
      if (h.cta_button.label) {
        const spanText = talkBtn.querySelector('span:first-child');
        if (spanText) spanText.textContent = h.cta_button.label;
      }
      if (h.cta_button.url) {
        talkBtn.href = h.cta_button.url;
      }
    }

    // Nav Links (Home, Services, Portfolio, About, Contact)
    if (Array.isArray(h.nav_links) && h.nav_links.length >= 5) {
      const links = document.querySelectorAll('.site-header .nav-list > .nav-item > a.nav-link');
      if (links.length >= 5) {
        // [0: Home, 1: Services, 2: Portfolio, 3: About, 4: Contact]
        h.nav_links.forEach((nl, idx) => {
          if (links[idx]) {
            const span = links[idx].querySelector('span');
            if (span && nl.label) span.textContent = nl.label;
            else if (nl.label) links[idx].textContent = nl.label;
            if (nl.url) links[idx].href = nl.url;
          }
        });
      }
    }

    // Portfolio Mega Menu Cards
    if (Array.isArray(h.portfolio_mega_menu) && h.portfolio_mega_menu.length) {
      const portGrid = document.querySelector('#portfolio-mega-menu .mega-menu-grid');
      if (portGrid) {
        portGrid.innerHTML = h.portfolio_mega_menu.map(cardData => {
          const cat = (cardData.url && cardData.url.includes('filter=')) ? cardData.url.split('filter=')[1] : 'web';
          return `
            <a href="${cardData.url}" class="mega-menu-card" data-category="${cat}" aria-label="${cardData.title} Portfolio">
              <div class="mega-card-media">
                <img src="${cardData.image}" alt="${cardData.title}" class="mega-card-img" width="360" height="240" loading="lazy">
                <div class="mega-card-overlay" aria-hidden="true"></div>
              </div>
              <div class="mega-card-content">
                <h4 class="mega-card-title">${cardData.title}</h4>
                <span class="mega-card-divider" aria-hidden="true"></span>
              </div>
            </a>
          `;
        }).join('');
      }
    }

    // Services Mega Menu Cards
    if (Array.isArray(h.services_mega_menu) && h.services_mega_menu.length) {
      const servCards = document.querySelectorAll('#services-mega-menu .mega-menu-card');
      h.services_mega_menu.forEach((cardData, idx) => {
        const cardEl = servCards[idx];
        if (!cardEl) return;
        if (cardData.url) cardEl.href = cardData.url;
        const img = cardEl.querySelector('.mega-card-img');
        if (img && cardData.image) img.src = cardData.image;
        const title = cardEl.querySelector('.mega-card-title');
        if (title && cardData.title) title.textContent = cardData.title;
      });
    }
  }

  // 2. Hero Hydration
  function hydrateHero(hero) {
    if (!hero) return;

    const mainHeadline = hero.main_headline || hero.headline?.main;
    const highlight = hero.highlighted_headline || hero.headline?.highlight || '';
    const description = hero.description || hero.headline?.description;

    // Headline & Highlight
    const headlineEl = document.querySelector('.hero-lens-headline');
    if (headlineEl && mainHeadline) {
      if (highlight && mainHeadline.includes(highlight)) {
        const parts = mainHeadline.split(highlight);
        headlineEl.innerHTML = `${parts[0]}<br><span class="hero-lime-tag">${highlight}</span>${parts[1] || ''}`;
      } else {
        headlineEl.innerHTML = `${mainHeadline}<br><span class="hero-lime-tag">${highlight}</span>`;
      }
    }

    // Subtitle Description
    const descEl = document.querySelector('.hero-lens-desc');
    if (descEl && description) {
      descEl.textContent = description;
    }

    // Availability Badge
    const availBadge = document.querySelector('.hero-top-badge');
    if (availBadge && hero.availability_badge) {
      if (hero.availability_badge.visible === false) {
        availBadge.style.display = 'none';
      } else {
        availBadge.style.display = '';
        const txt = availBadge.querySelector('span:last-child');
        if (txt) {
          const status = hero.availability_badge.status_text || 'Now booking';
          const qtr = hero.availability_badge.current_quarter || 'Q1 2026';
          const spots = hero.availability_badge.available_spots ?? 2;
          txt.innerHTML = `${status} ${qtr} &middot; ${spots} spots left`;
        }
      }
    }

    // CTA Buttons
    if (hero.cta_buttons) {
      const primaryBtn = document.querySelector('.hero-btn-dark');
      if (primaryBtn && hero.cta_buttons.primary) {
        const pLabel = primaryBtn.querySelector('span:first-child');
        if (pLabel && hero.cta_buttons.primary.label) pLabel.textContent = hero.cta_buttons.primary.label;
        if (hero.cta_buttons.primary.url) primaryBtn.href = hero.cta_buttons.primary.url;
      }
      const secBtn = document.querySelector('.hero-btn-glass');
      if (secBtn && hero.cta_buttons.secondary) {
        const sLabel = secBtn.querySelector('span:first-child');
        if (sLabel && hero.cta_buttons.secondary.label) sLabel.textContent = hero.cta_buttons.secondary.label;
        if (hero.cta_buttons.secondary.url) secBtn.href = hero.cta_buttons.secondary.url;
      }
    }

    // Statistics Strip
    if (hero.statistics) {
      const statLabel = document.querySelector('.hero-stat-kicker');
      if (statLabel && hero.statistics.people_reached_label) {
        const dot = statLabel.querySelector('.stat-kicker-dot');
        statLabel.innerHTML = '';
        if (dot) statLabel.appendChild(dot);
        statLabel.appendChild(document.createTextNode(' ' + hero.statistics.people_reached_label.toUpperCase()));
      }
      const statHuge = document.querySelector('.hero-stat-huge');
      if (statHuge && hero.statistics.people_reached_counter) {
        statHuge.textContent = hero.statistics.people_reached_counter;
      }
      const revScore = document.querySelector('.hero-review-score');
      if (revScore && hero.statistics.client_rating && hero.statistics.reviews_count) {
        revScore.innerHTML = `${hero.statistics.client_rating} &middot; ${hero.statistics.reviews_count}`;
      }
      const revSub = document.querySelector('.hero-review-sub');
      if (revSub && hero.statistics.brands_grown) {
        revSub.textContent = hero.statistics.brands_grown;
      }
    }

    // Social proof rank pill
    const rankPill = document.querySelector('.pill-bottom-right span:last-child');
    if (rankPill && hero.social_proof?.search_ranking_label) {
      rankPill.textContent = hero.social_proof.search_ranking_label;
    }
  }

  // 2B. Client Radar Hydration
  function hydrateRadar(radar) {
    if (!radar) return;
    const kicker = document.querySelector('.radar-kicker-badge span:last-child');
    if (kicker && radar.kicker) kicker.textContent = radar.kicker;

    const headline = document.querySelector('.radar-headline');
    if (headline && (radar.heading_line1 || radar.heading_highlight)) {
      headline.innerHTML = `${radar.heading_line1 || ''}<br><span class="radar-highlight-pill">${radar.heading_highlight || ''}</span>`;
    }

    const sub = document.querySelector('.radar-subtext');
    if (sub && radar.description) sub.textContent = radar.description;
  }

  // 3. Services Hydration
  function hydrateServices(servicesData) {
    if (!servicesData) return;

    const kicker = document.querySelector('.services-kicker-pill span:last-child');
    if (kicker && servicesData.section_badge) kicker.textContent = servicesData.section_badge;

    const mainTitle = document.querySelector('#services-main-heading');
    if (mainTitle && servicesData.heading) {
      mainTitle.innerHTML = servicesData.heading.replace(/\n/g, '<br>');
    }

    const subtext = document.querySelector('.services-subtext');
    if (subtext && servicesData.subtitle) subtext.textContent = servicesData.subtitle;

    // Update individual accordion cards if present
    const svcItems = Array.isArray(servicesData) ? servicesData : (Array.isArray(servicesData.services) ? servicesData.services : null);
    if (svcItems) {
      const articles = document.querySelectorAll('.services-accordion-stack .service-acc-item');
      svcItems.forEach((svc, idx) => {
        const art = articles[idx];
        if (!art) return;

        // Title
        const titleEl = art.querySelector('.acc-title');
        if (titleEl && svc.title) titleEl.textContent = svc.title;

        // Search bar in mockup
        const searchInput = art.querySelector('.mockup-search-input');
        if (searchInput && svc.search_query_heading) {
          searchInput.value = svc.search_query_heading;
        }

        // Pitch text
        const pitch = art.querySelector('.service-pitch-text');
        if (pitch && svc.description) pitch.textContent = svc.description;

        // Features list
        if (Array.isArray(svc.features) && svc.features.length) {
          const featList = art.querySelector('.deliverables-list');
          if (featList) {
            featList.innerHTML = svc.features.map(f => `<li class="deliverables-item"><span class="deliverable-check" aria-hidden="true">&#10003;</span> ${f}</li>`).join('');
          }
        }

        // Starting price
        const priceVal = art.querySelector('.price-value');
        if (priceVal && svc.starting_price) priceVal.textContent = svc.starting_price;

        // Metric tag
        const metricEl = art.querySelector('.service-metric-tag');
        if (metricEl && svc.performance_metric?.value) {
          metricEl.textContent = `★ ${svc.performance_metric.value} ${svc.performance_metric.label || ''}`;
        }
      });
    }
  }

  // 4. Featured Work Hydration
  async function hydrateFeaturedWork(fwData) {
    if (!fwData) return;

    const kicker = document.querySelector('.portfolio-kicker-capsule span:last-child');
    if (kicker && fwData.section_badge) kicker.textContent = fwData.section_badge;

    const heading = document.querySelector('#portfolio-showcase-heading');
    if (heading && fwData.heading) {
      heading.innerHTML = fwData.heading.replace(/\n/g, '<br>');
    }

    const sub = document.querySelector('.portfolio-subtext');
    if (sub && fwData.subtitle) sub.textContent = fwData.subtitle;

    const ctaBtn = document.querySelector('.btn-all-portfolio');
    if (ctaBtn && fwData.all_projects_button) {
      if (fwData.all_projects_button.label) {
        const s = ctaBtn.querySelector('span:first-child');
        if (s) s.textContent = fwData.all_projects_button.label;
      }
      if (fwData.all_projects_button.url) ctaBtn.href = fwData.all_projects_button.url;
    }

    // Hydrate projects from database (strictly the 3 projects featured on homepage)
    try {
      const pRes = await fetch('/api/projects');
      if (pRes.ok) {
        const allProjects = await pRes.json();
        let selectedProjects = allProjects.filter(p => Boolean(p.at_home_page));
        if (!selectedProjects.length && Array.isArray(fwData.selected_project_ids)) {
          selectedProjects = fwData.selected_project_ids
            .map(id => allProjects.find(p => String(p.id) === String(id) || String(p.slug) === String(id)))
            .filter(Boolean);
        }

        const deck = document.querySelector('.portfolio-showcase-deck');
        if (deck && selectedProjects.length) {
          const toRender = selectedProjects.slice(0, 3);

          deck.innerHTML = toRender.map((p, idx) => {
            const numStr = (idx + 1) < 10 ? '0' + (idx + 1) : String(idx + 1);
            const coverImg = (p.images && p.images[0]) ? ('/' + p.images[0].replace(/^[\/\\]+/, '')) : '/assets/portfolio-hero-1.png';
            const techTags = (p.technologies || []).slice(0, 3).map(t => `<span class="feature-tech-pill">${t}</span>`).join('');
            const projUrl = p.slug ? `projects/${p.slug}/` : `portfolio.html?project=${p.id}`;
            const cleanUrl = p.url ? p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'baadam.com';
            const beaconClass = idx === 1 ? 'beacon-emerald' : (idx === 2 ? 'beacon-blue' : '');
            const pillClass = idx === 1 ? 'feature-live-pill feature-live-pill-emerald' : (idx === 2 ? 'feature-live-pill feature-live-pill-blue' : 'feature-live-pill');

            return `
              <a href="${projUrl}" class="portfolio-feature-card scroll-reveal is-revealed" data-project="${p.id || p.slug}" aria-label="View ${p.title} Project Details">
                <div class="feature-card-glow" aria-hidden="true"></div>
                <div class="feature-card-media-wrap">
                  <div class="feature-card-chrome-bar" aria-hidden="true">
                    <span class="chrome-dot chrome-dot-red"></span>
                    <span class="chrome-dot chrome-dot-yellow"></span>
                    <span class="chrome-dot chrome-dot-green"></span>
                    <span class="chrome-url-pill">${cleanUrl}</span>
                  </div>
                  <div class="feature-media-overflow">
                    <img src="${coverImg}" alt="${p.title}" class="feature-media-img" width="460" height="240" loading="lazy">
                  </div>
                  <div class="${pillClass}">
                    <span class="live-dot-beacon ${beaconClass}"></span>
                    <span>${p.category || 'Featured'} &middot; Active</span>
                  </div>
                </div>

                <div class="feature-card-body">
                  <div class="feature-meta-kicker">
                    <span class="feature-kicker-cat">${p.category || 'Enterprise Solution'}</span>
                    <span class="feature-kicker-idx">${numStr}</span>
                  </div>
                  <h3 class="feature-card-title">${p.title}</h3>
                  <p class="feature-card-desc">
                    ${p.description || 'Bespoke technology architecture designed for scale and enterprise reliability.'}
                  </p>
                  <div class="feature-card-footer">
                    <div class="feature-tech-tags">
                      ${techTags}
                    </div>
                  </div>
                </div>
              </a>
            `;
          }).join('');
        }
      }
    } catch (err) {
      console.warn('[BAADAM CMS] Error populating selected projects:', err);
    }
  }

  // 5. Case Studies Hydration
  function hydrateCaseStudies(csData) {
    if (!csData) return;

    const kicker = document.querySelector('.case-kicker-capsule span:last-child');
    if (kicker && csData.section_badge) kicker.textContent = csData.section_badge;

    const titleEl = document.querySelector('#case-studies-heading');
    if (titleEl && csData.heading) {
      titleEl.innerHTML = csData.heading.replace(/\n/g, '<br>');
    }

    const sub = document.querySelector('.case-subtext');
    if (sub && csData.subtitle) sub.textContent = csData.subtitle;
  }

  // 6. How We Work Hydration
  function hydrateHowWeWork(hwwData) {
    if (!hwwData) return;

    const kicker = document.querySelector('.funnel-kicker-capsule span:last-child');
    if (kicker && hwwData.section_badge) kicker.textContent = hwwData.section_badge;

    const titleEl = document.querySelector('#funnel-heading');
    if (titleEl && hwwData.heading) {
      titleEl.innerHTML = hwwData.heading.replace(/\n/g, '<br>');
    }

    const sub = document.querySelector('.funnel-subtext');
    if (sub && hwwData.subtitle) sub.textContent = hwwData.subtitle;

    if (Array.isArray(hwwData.stages)) {
      const cards = document.querySelectorAll('.funnel-cards-grid .funnel-card');
      hwwData.stages.forEach((stage, idx) => {
        const card = cards[idx];
        if (!card) return;

        const numEl = card.querySelector('.funnel-stat-num');
        if (numEl && stage.metric_value) numEl.textContent = stage.metric_value;

        const titleEl = card.querySelector('.funnel-step-title');
        if (titleEl && stage.title) titleEl.textContent = stage.title;

        const descEl = card.querySelector('.funnel-step-desc');
        if (descEl && stage.description) descEl.textContent = stage.description;

        const weekEl = card.querySelector('.funnel-step-week-pill');
        if (weekEl && stage.timeline) weekEl.textContent = stage.timeline.toUpperCase();
      });
    }
  }

  // 7. Next Steps / CTA Hydration
  function hydrateNextSteps(nsData) {
    if (!nsData) return;

    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      if (nsData.visible === false) {
        ctaSection.style.display = 'none';
        return;
      } else {
        ctaSection.style.display = '';
      }
    }

    const kicker = document.querySelector('.cta-banner-text .kicker-capsule span:last-child');
    if (kicker && nsData.section_badge) kicker.textContent = nsData.section_badge;

    const heading = document.querySelector('#cta-heading');
    if (heading && nsData.heading) {
      heading.innerHTML = nsData.heading.replace(/\n/g, '<br>');
    }

    const desc = document.querySelector('.cta-banner-desc');
    if (desc && nsData.description) desc.textContent = nsData.description;

    const ctaBtn = document.querySelector('.cta-banner-btn-wrap a');
    if (ctaBtn && nsData.cta_button) {
      if (nsData.cta_button.label) {
        const s = ctaBtn.querySelector('span:first-child');
        if (s) s.textContent = nsData.cta_button.label;
      }
      if (nsData.cta_button.url) ctaBtn.href = nsData.cta_button.url;
    }

    const img = document.querySelector('.cta-collab-img');
    if (img && nsData.side_image) {
      img.src = nsData.side_image;
    }
  }

  // 9. Canonical Footer Hydration
  function hydrateFooter(ft) {
    if (!ft) return;
    const desc = document.querySelector('.footer-brand-desc');
    if (desc && ft.brand_desc) desc.textContent = ft.brand_desc;

    const emailEl = document.querySelector('a.footer-nav-link[href^="mailto:"]');
    if (emailEl && ft.email) {
      emailEl.href = 'mailto:' + ft.email;
      emailEl.textContent = ft.email;
    }

    if (ft.social_linkedin) {
      const ln = document.querySelector('a.footer-social-btn[aria-label="LinkedIn"]');
      if (ln) ln.href = ft.social_linkedin;
    }

    if (ft.social_instagram) {
      const ig = document.querySelector('a.footer-social-btn[aria-label="Instagram"]');
      if (ig) ig.href = ft.social_instagram;
    }
  }

  // Initialize on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomepageCMS);
  } else {
    initHomepageCMS();
  }
})();
