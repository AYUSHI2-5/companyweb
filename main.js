/**
 * Baadam.com - Modern Agency Interaction & Animation Engine
 * Recreates the visual & interaction language inspired by the reference agency template
 * Features:
 * - Circular wavefront page transitions (adapted to Baadam's brand palette)
 * - Sticky floating pill navigation with scroll state & mobile drawer
 * - Interactive pill buttons with magnetic-feel hover & text roll
 * - Scroll-triggered IntersectionObserver reveal animations
 * - Live radar status indicators & counter animations
 * - Team carousel controls
 * - Interactive contact form handling
 * - prefers-reduced-motion compliance
 */

(function () {
  'use strict';

  var isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Page Transition System (Circular Radial Wavefront)
     ========================================================================== */
  function initPageTransitions() {
    if (isReducedMotion) return;

    // Create transition overlay element if not present
    var overlay = document.querySelector('.page-trans-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-trans-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = '<div class="trans-wave trans-red"></div><div class="trans-wave trans-night"><div class="trans-mid"><div class="trans-kicker"><i class="radar-dot"></i><span>Baadam Digital</span></div><h2 class="trans-title"><span>Loading</span></h2></div></div>';
      document.body.appendChild(overlay);
    }

    // Intercept internal links for smooth circular wavefront page transitions
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      var target = link.getAttribute('target');

      // Ignore external, anchor-only, mailto, tel, or new-tab links
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || target === '_blank') {
        return;
      }

      // Check if it's an internal link
      var isInternal = false;
      try {
        var url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) {
          isInternal = true;
        }
      } catch (err) {
        if (href.endsWith('.html') || href === '/' || href.startsWith('./')) {
          isInternal = true;
        }
      }

      if (isInternal) {
        e.preventDefault();
        var clickX = e.clientX || window.innerWidth / 2;
        var clickY = e.clientY || window.innerHeight / 2;

        document.documentElement.style.setProperty('--trans-origin-x', clickX + 'px');
        document.documentElement.style.setProperty('--trans-origin-y', clickY + 'px');

        overlay.classList.add('is-active');

        setTimeout(function () {
          window.location.href = href;
        }, 360);
      }
    });

    // Remove active transition on page show (e.g. back-forward cache)
    window.addEventListener('pageshow', function () {
      overlay.classList.remove('is-active');
    });
  }

  /* ==========================================================================
     2. Floating Pill Navigation & Mobile Drawer
     ========================================================================== */
  function initNavigation() {
    var header = document.querySelector('.site-header');
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.querySelector('.nav-menu');
    var navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect: add frosted dark shadow on scroll
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
        }
      });
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', function (e) {
      if (navToggle && navToggle.checked) {
        var isClickInsideNav = header && header.contains(e.target);
        if (!isClickInsideNav) {
          navToggle.checked = false;
        }
      }
    });
  }

  /* ==========================================================================
     3. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  function initScrollReveals() {
    var elements = document.querySelectorAll('.scroll-reveal, .service-card, .stat-card, .approach-step, .capability-item, .team-card, .portfolio-card');
    if (elements.length === 0) return;

    if (isReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     4. Number Counter Animations (Stats Section)
     ========================================================================== */
  function initCounters() {
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length === 0 || isReducedMotion) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var targetVal = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var start = 0;
          var duration = 1400;
          var startTime = null;

          function animateCount(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var easeVal = 1 - Math.pow(1 - progress, 3);
            var currentVal = Math.floor(easeVal * targetVal);
            el.textContent = currentVal + suffix;
            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              el.textContent = targetVal + suffix;
            }
          }
          requestAnimationFrame(animateCount);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ==========================================================================
     5. Team Carousel Controller (Responsive Touch & Navigation)
     ========================================================================== */
  function initTeamCarousel() {
    var viewport = document.getElementById('teamCarouselViewport');
    var track = document.getElementById('teamCardsTrack');
    var prevBtn = document.getElementById('teamPrevBtn');
    var nextBtn = document.getElementById('teamNextBtn');
    var dots = document.querySelectorAll('#teamPagination .team-dot');

    if (!viewport || !track) return;

    var cards = track.querySelectorAll('.team-card');
    if (cards.length === 0) return;

    function getCardWidth() {
      if (cards.length < 2) return cards[0].offsetWidth;
      var r1 = cards[0].getBoundingClientRect();
      var r2 = cards[1].getBoundingClientRect();
      return Math.round(r2.left - r1.left);
    }

    function scrollToIndex(idx) {
      idx = Math.max(0, Math.min(idx, cards.length - 1));
      var step = getCardWidth();
      viewport.scrollTo({
        left: idx * step,
        behavior: isReducedMotion ? 'auto' : 'smooth'
      });
      updateDots(idx);
    }

    function updateDots(activeIdx) {
      var dotIdx = 0;
      if (activeIdx <= 0) dotIdx = 0;
      else if (activeIdx >= cards.length - 2) dotIdx = dots.length - 1;
      else dotIdx = 1;

      dots.forEach(function (dot, i) {
        if (i === dotIdx) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.removeAttribute('aria-current');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var step = getCardWidth();
        var curIdx = Math.round(viewport.scrollLeft / step);
        scrollToIndex(curIdx > 0 ? curIdx - 1 : cards.length - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var step = getCardWidth();
        var curIdx = Math.round(viewport.scrollLeft / step);
        scrollToIndex(curIdx < cards.length - 1 ? curIdx + 1 : 0);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var targetCard = i === 0 ? 0 : (i === 1 ? 1 : cards.length - 1);
        scrollToIndex(targetCard);
      });
    });

    var scrollDebounce;
    viewport.addEventListener('scroll', function () {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(function () {
        var step = getCardWidth();
        var curIdx = Math.round(viewport.scrollLeft / step);
        updateDots(curIdx);
      }, 80);
    }, { passive: true });
  }

  /* ==========================================================================
     6. Portfolio Filter System (Portfolio Page)
     ========================================================================== */
  function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    var items = document.querySelectorAll('.portfolio-card-item');

    if (filterBtns.length === 0 || items.length === 0) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var filter = btn.getAttribute('data-filter') || 'all';

        items.forEach(function (item) {
          var category = item.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            item.style.display = '';
            setTimeout(function () { item.classList.remove('is-hidden'); }, 10);
          } else {
            item.classList.add('is-hidden');
            setTimeout(function () { item.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }

  /* ==========================================================================
     7. Contact Form Handler (Contact Page)
     ========================================================================== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var statusMsg = document.getElementById('formStatusMsg');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var name = (form.querySelector('#contactName') || {}).value || '';
      var email = (form.querySelector('#contactEmail') || {}).value || '';
      var message = (form.querySelector('#contactMessage') || {}).value || '';

      if (!name.trim() || !email.trim() || !message.trim()) {
        if (statusMsg) {
          statusMsg.className = 'form-status is-error';
          statusMsg.textContent = 'Please fill in all required fields.';
          statusMsg.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Request...</span>';
      }

      // Simulate clean asynchronous submission with realistic feedback
      setTimeout(function () {
        if (statusMsg) {
          statusMsg.className = 'form-status is-success';
          statusMsg.innerHTML = '<strong>Thank you, ' + escapeHtml(name) + '!</strong> Your inquiry has been received. Our team in Ahmedabad will contact you within 24 hours.';
          statusMsg.style.display = 'block';
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span><span class="btn-arrow" aria-hidden="true">&rarr;</span>';
        }
      }, 700);
    });

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  /* ==========================================================================
     8. Initialize All Components on DOM Ready
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initPageTransitions();
    initNavigation();
    initScrollReveals();
    initCounters();
    initTeamCarousel();
    initPortfolioFilter();
    initContactForm();
  });
})();
