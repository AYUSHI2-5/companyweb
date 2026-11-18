/**
 * BAADAM CMS - About Us Page Hydration Engine
 * Seamlessly hydrates about.html from published CMS data (or draft in preview mode)
 * Preserves agency typography, interactive circular gauge meters, scroll reveals,
 * leadership grid, and testimonials.
 */

(function () {
  'use strict';

  async function hydrateAboutPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'draft' || urlParams.get('preview') === 'true';
    const endpoint = isPreview ? '/api/about-page/draft' : '/api/about-page/published';

    try {
      const cacheBuster = `t=${Date.now()}`;
      const fetchUrl = endpoint.includes('?') ? `${endpoint}&${cacheBuster}` : `${endpoint}?${cacheBuster}`;
      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const content = isPreview ? data.draft : data.published;
      if (!content) return;

      // 1. Hero Section
      if (content.hero) {
        const h = content.hero;
        const kicker = document.querySelector('.about-kicker span');
        if (kicker && h.kicker) kicker.textContent = h.kicker;

        const heading = document.querySelector('.about-hero-heading');
        if (heading && h.heading) heading.innerHTML = h.heading;

        const subhead = document.querySelector('.about-hero-subhead');
        if (subhead && h.subhead) subhead.textContent = h.subhead;

        const lead = document.querySelector('.about-hero-lead');
        if (lead && h.lead) lead.textContent = h.lead;

        const heroImg = document.querySelector('.about-office-showcase-img');
        if (heroImg && h.image) heroImg.src = h.image;

        // Trust items
        if (Array.isArray(h.trust_items) && h.trust_items.length === 3) {
          const trustItems = document.querySelectorAll('.about-trust-item');
          h.trust_items.forEach((ti, idx) => {
            if (trustItems[idx]) {
              const strong = trustItems[idx].querySelector('strong');
              const span = trustItems[idx].querySelector('span');
              if (strong && ti.value) strong.textContent = ti.value;
              if (span && ti.label) span.textContent = ti.label;
            }
          });
        }
      }

      // 2. What We Do Section
      if (content.what_we_do) {
        const wwd = content.what_we_do;
        const whatHeading = document.querySelector('.about-section .section-heading');
        if (whatHeading && wwd.heading) whatHeading.innerHTML = wwd.heading;

        const descs = document.querySelectorAll('.about-section .about-description');
        if (descs[0] && wwd.description_1) descs[0].textContent = wwd.description_1;
        if (descs[1] && wwd.description_2) descs[1].textContent = wwd.description_2;

        const whatImg = document.querySelector('.about-office-img');
        if (whatImg && wwd.image) whatImg.src = wwd.image;
      }

      // 3. Capabilities Gauges
      if (content.skills_metrics && Array.isArray(content.skills_metrics.gauges)) {
        const gauges = content.skills_metrics.gauges;
        const gaugeItems = document.querySelectorAll('.skills-gauges-grid .gauge-item');
        gauges.forEach((g, idx) => {
          if (gaugeItems[idx]) {
            const numEl = gaugeItems[idx].querySelector('.gauge-percent');
            const labelEl = gaugeItems[idx].querySelector('.gauge-label');
            const circleBar = gaugeItems[idx].querySelector('.gauge-bar');
            if (numEl) {
              numEl.textContent = `${g.percent}%`;
              numEl.setAttribute('data-count', g.percent);
            }
            if (labelEl) labelEl.textContent = g.label;
            if (circleBar) {
              const radius = 52;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (g.percent / 100) * circumference;
              circleBar.style.strokeDashoffset = `${offset.toFixed(2)}px`;
            }
          }
        });
      }

      // 4. Approach Section
      if (content.approach) {
        const app = content.approach;
        const appHeading = document.getElementById('approach-heading');
        if (appHeading && app.heading) appHeading.innerHTML = app.heading;

        const appLead = document.querySelector('.approach-lead-text');
        if (appLead && app.lead) appLead.textContent = app.lead;

        if (Array.isArray(app.cards) && app.cards.length > 0) {
          const cardEls = document.querySelectorAll('.approach-feature-card');
          app.cards.forEach((c, idx) => {
            if (cardEls[idx]) {
              const pill = cardEls[idx].querySelector('.approach-stat-pill');
              const title = cardEls[idx].querySelector('.approach-card-title');
              const desc = cardEls[idx].querySelector('.approach-card-desc');
              if (pill && c.pill) pill.textContent = c.pill;
              if (title && c.title) title.textContent = c.title;
              if (desc && c.desc) desc.textContent = c.desc;
            }
          });
        }
      }

      // 5. Principles
      if (content.principles) {
        const pr = content.principles;
        const prHeading = document.querySelector('.stats-section .section-heading');
        if (prHeading && pr.heading) prHeading.innerHTML = pr.heading;

        const prDesc = document.querySelector('.stats-section .section-description');
        if (prDesc && pr.description) prDesc.textContent = pr.description;

        if (Array.isArray(pr.items) && pr.items.length > 0) {
          const prItems = document.querySelectorAll('.capabilities-grid .capability-item');
          pr.items.forEach((item, idx) => {
            if (prItems[idx]) {
              const title = prItems[idx].querySelector('.capability-title');
              const desc = prItems[idx].querySelector('.capability-desc');
              if (title && item.title) title.textContent = item.title;
              if (desc && item.desc) desc.textContent = item.desc;
            }
          });
        }
      }

      // 6. Leadership Team
      if (content.team) {
        const tm = content.team;
        const tmHeading = document.getElementById('team-heading');
        if (tmHeading && tm.heading) tmHeading.innerHTML = tm.heading;

        const tmDesc = document.querySelector('.team-section .section-description');
        if (tmDesc && tm.description) tmDesc.textContent = tm.description;

        if (Array.isArray(tm.members) && tm.members.length > 0) {
          const grid = document.querySelector('.team-cards-grid');
          if (grid) {
            grid.innerHTML = tm.members.map(m => `
              <article class="team-card scroll-reveal is-revealed" style="width: 100%;">
                <div class="team-card-image-wrap">
                  <img src="${m.image || 'assets/team-placeholder.jpg'}" alt="${m.name} - ${m.role}" class="team-card-img" width="290" height="310" onerror="this.src='/assets/team-mk-parmar.jpg'">
                </div>
                <div class="team-card-content">
                  <h3 class="team-card-name">${m.name}</h3>
                  <div class="team-card-role">${m.role}</div>
                  <p class="team-card-desc">${m.desc || ''}</p>
                </div>
              </article>
            `).join('');
          }
        }
      }

      // 7. Testimonials
      if (content.testimonials) {
        const tst = content.testimonials;
        const tstHeading = document.getElementById('testimonials-heading');
        if (tstHeading && tst.heading) tstHeading.innerHTML = tst.heading;

        const tstDesc = document.querySelector('.testimonials-section .section-description');
        if (tstDesc && tst.description) tstDesc.textContent = tst.description;

        if (Array.isArray(tst.items) && tst.items.length > 0) {
          const grid = document.querySelector('.testimonials-grid');
          if (grid) {
            grid.innerHTML = tst.items.map(t => {
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
                </article>
              `;
            }).join('');
          }
        }
      }

      // 8. CTA Banner
      if (content.cta) {
        const cta = content.cta;
        const ctaHead = document.querySelector('.cta-banner-heading');
        if (ctaHead && cta.heading) ctaHead.innerHTML = cta.heading;

        const ctaDesc = document.querySelector('.cta-banner-desc');
        if (ctaDesc && cta.description) ctaDesc.textContent = cta.description;

        const ctaBtn = document.querySelector('.cta-banner-btn-wrap .btn-pill span:first-child');
        if (ctaBtn && cta.button_label) ctaBtn.textContent = cta.button_label;

        const ctaLink = document.querySelector('.cta-banner-btn-wrap .btn-pill');
        if (ctaLink && cta.button_url) ctaLink.href = cta.button_url;
      }

      // Make sure scroll reveals are triggered
      document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));

      // If in preview mode, render a floating indicator banner
      if (isPreview) {
        const previewBanner = document.createElement('div');
        previewBanner.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#E7192D; color:#fff; font-size:12px; font-weight:700; padding:8px 16px; border-radius:999px; box-shadow:0 10px 25px rgba(231,25,45,0.4); z-index:9999; display:flex; align-items:center; gap:8px;';
        previewBanner.innerHTML = '<span>● About Page Draft Preview</span> <a href="/admin/about.html" style="color:#fff; text-decoration:underline; margin-left:6px;">Back to Editor</a>';
        document.body.appendChild(previewBanner);
      }
    } catch (e) {
      console.warn('About CMS hydration notice:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateAboutPage);
  } else {
    hydrateAboutPage();
  }
})();
