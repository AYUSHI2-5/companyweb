/**
 * BAADAM Portfolio Image-Based Mega Menu Dropdown
 * Handles keyboard accessibility, anti-flicker hover debouncing,
 * mobile/touch toggle, and seamless URL category filtering.
 */
(function () {
  'use strict';

  function initPortfolioMegaMenu() {
    var dropdownItems = document.querySelectorAll('.nav-item-has-dropdown');
    if (!dropdownItems.length) return;

    dropdownItems.forEach(function (item) {
      var trigger = item.querySelector('.nav-link-dropdown-trigger, a[aria-haspopup="true"]');
      var menu = item.querySelector('.portfolio-mega-menu');
      if (!trigger || !menu) return;

      var closeTimer = null;
      var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

      function openMenu() {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
        item.classList.add('is-open');
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function closeMenu(immediate) {
        if (immediate) {
          if (closeTimer) clearTimeout(closeTimer);
          item.classList.remove('is-open');
          menu.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          if (closeTimer) clearTimeout(closeTimer);
          closeTimer = setTimeout(function () {
            item.classList.remove('is-open');
            menu.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
          }, 180); // 180ms grace period prevents flicker when moving diagonally
        }
      }

      // Desktop Hover
      item.addEventListener('mouseenter', function () {
        if (window.innerWidth > 992) {
          openMenu();
        }
      });

      item.addEventListener('mouseleave', function () {
        if (window.innerWidth > 992) {
          closeMenu(false);
        }
      });

      // Keyboard Accessibility
      trigger.addEventListener('focus', function () {
        if (window.innerWidth > 992) {
          openMenu();
        }
      });

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeMenu(true);
          trigger.focus();
        }
      });

      // Close when focus leaves the entire dropdown item
      item.addEventListener('focusout', function (e) {
        if (window.innerWidth > 992) {
          if (!item.contains(e.relatedTarget)) {
            closeMenu(true);
          }
        }
      });

      // Mobile / Touch click toggle
      trigger.addEventListener('click', function (e) {
        var isMobile = window.innerWidth <= 992;
        var chevron = e.target.closest('.dropdown-chevron');

        if (isMobile || chevron || (isTouchDevice && !item.classList.contains('is-open'))) {
          // If clicking chevron or on mobile, toggle menu instead of navigating immediately
          if (isMobile || !item.classList.contains('is-open')) {
            e.preventDefault();
            if (item.classList.contains('is-open')) {
              closeMenu(true);
            } else {
              openMenu();
            }
          }
        }
      });

      // Category Card Click on Portfolio Page
      var cards = menu.querySelectorAll('.mega-menu-card');
      cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
          var targetCat = card.getAttribute('data-category');
          var targetService = card.getAttribute('data-service');
          var isPortfolioPage = window.location.pathname.endsWith('portfolio.html') || 
                                window.location.pathname.endsWith('portfolio') || 
                                (window.location.pathname === '/' && document.querySelector('.portfolio-filter-bar'));
          var isServicesPage = window.location.pathname.endsWith('services.html') || 
                               window.location.pathname.endsWith('services');

          if (isPortfolioPage && targetCat) {
            var filterBtn = document.querySelector('.portfolio-filter-btn[data-filter="' + targetCat + '"]');
            if (filterBtn) {
              e.preventDefault();
              closeMenu(true);
              filterBtn.click();
              var grid = document.querySelector('.portfolio-filter-bar, .portfolio-grid');
              if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              // Update URL query without full reload
              if (window.history.pushState) {
                var newUrl = window.location.pathname + '?filter=' + encodeURIComponent(targetCat);
                window.history.pushState({ filter: targetCat }, '', newUrl);
              }
            }
          } else if (isServicesPage && targetService) {
            var targetEl = document.getElementById(targetService);
            if (targetEl) {
              e.preventDefault();
              closeMenu(true);
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    });

    // Global Click Outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item-has-dropdown')) {
        dropdownItems.forEach(function (item) {
          item.classList.remove('is-open');
          var m = item.querySelector('.portfolio-mega-menu');
          var t = item.querySelector('a[aria-haspopup="true"]');
          if (m) m.classList.remove('is-open');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Auto-activate filter from URL parameter on page load
    try {
      var params = new URLSearchParams(window.location.search);
      var filterParam = params.get('filter') || params.get('category');
      if (filterParam) {
        var targetBtn = document.querySelector('.portfolio-filter-btn[data-filter="' + filterParam.toLowerCase() + '"]');
        if (targetBtn) {
          setTimeout(function () {
            targetBtn.click();
          }, 100);
        }
      }
    } catch (err) {
      // Ignore URLSearchParams error in older environments
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioMegaMenu);
  } else {
    initPortfolioMegaMenu();
  }
})();
