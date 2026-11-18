/**
 * BAADAM CMS - Services Page Hydration Engine
 * Seamlessly hydrates services.html from published CMS data (or draft in preview mode)
 * Preserves exact DOM hierarchy, circular icon containers, 3D hover effects, and responsive grid.
 */

(function () {
  'use strict';

  // Preset SVGs fallback dictionary
  const PRESET_SVGS = {
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
    smartphone: '<rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"></line>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>',
    'shopping-cart': '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
    code: '<polyline points="7 8 3 12 7 16"></polyline><line x1="14" y1="5" x2="10" y2="19"></line><polyline points="17 8 21 12 17 16"></polyline>',
    gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"></rect><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15.5" cy="11" r="0.75" fill="#eb163c"></circle><circle cx="17.5" cy="13" r="0.75" fill="#eb163c"></circle>'
  };

  async function hydrateServicesPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'draft' || urlParams.get('preview') === 'true';
    const endpoint = isPreview ? '/api/services-page/draft' : '/api/services-page/published';

    try {
      const cacheBuster = `t=${Date.now()}`;
      const fetchUrl = endpoint.includes('?') ? `${endpoint}&${cacheBuster}` : `${endpoint}?${cacheBuster}`;
      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const content = isPreview ? data.draft : data.published;
      if (!content) return;

      // 1. Hydrate Header Section
      if (content.header) {
        const h = content.header;
        const mainTitle = document.getElementById('services-main-heading');
        if (mainTitle && h.heading) {
          mainTitle.textContent = h.heading;
        }

        const subtitleEl = document.querySelector('.services-showcase-subtitle');
        if (subtitleEl && (h.subtitle_line1 || h.subtitle_line2)) {
          const s1 = h.subtitle_line1 || '';
          const s2 = h.subtitle_line2 || '';
          subtitleEl.textContent = `${s1} ${s2}`.trim();
        }

        const sepWrap = document.querySelector('.services-accent-wrap');
        if (sepWrap) {
          sepWrap.style.display = h.separator_visible === false ? 'none' : 'flex';
          const path = sepWrap.querySelector('path');
          if (path && h.separator_color) {
            path.setAttribute('stroke', h.separator_color);
          }
        }
      }

      // 2. Hydrate Grid Settings
      if (content.grid_settings) {
        const gs = content.grid_settings;
        const grid = document.querySelector('.services-showcase-grid');
        const section = document.querySelector('.services-showcase-section');

        if (section) {
          if (gs.padding_top) section.style.paddingTop = `${gs.padding_top}px`;
          if (gs.padding_bottom) section.style.paddingBottom = `${gs.padding_bottom}px`;
        }
        if (grid && gs.gap) {
          grid.style.gap = `${gs.gap}px`;
        }
      }

      // 3. Hydrate Service Cards
      if (Array.isArray(content.services) && content.services.length) {
        const grid = document.querySelector('.services-showcase-grid');
        if (!grid) return;

        const activeServices = content.services.filter(s => s.active !== false);
        if (!activeServices.length) return;

        grid.innerHTML = activeServices.map((svc, idx) => {
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
            <article class="service-showcase-card scroll-reveal" id="${svc.id || ('service-' + (idx+1))}" style="${featuredStyle}">
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
            </article>
          `;
        }).join('');

        // Re-bind dynamic mouse spotlight effect & scroll reveal
        const obs = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' }) : null;

        document.querySelectorAll('.service-showcase-card').forEach(card => {
          card.classList.add('is-revealed');
          if (obs) obs.observe(card);

          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          });
        });
      }

      // If in preview mode, render a floating indicator banner
      if (isPreview) {
        const previewBanner = document.createElement('div');
        previewBanner.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#E7192D; color:#fff; font-size:12px; font-weight:700; padding:8px 16px; border-radius:999px; box-shadow:0 10px 25px rgba(231,25,45,0.4); z-index:9999; display:flex; align-items:center; gap:8px;';
        previewBanner.innerHTML = '<span>● CMS Draft Preview Mode</span> <a href="/admin/services.html" style="color:#fff; text-decoration:underline;">Back to Admin</a>';
        document.body.appendChild(previewBanner);
      }
    } catch (e) {
      console.warn('Services CMS hydration note: serving static HTML fallback.', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateServicesPage);
  } else {
    hydrateServicesPage();
  }
})();
