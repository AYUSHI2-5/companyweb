/**
 * Baadam Info and Tradelink Services Pvt. Ltd.
 * Global Reusable Scroll Animation Trigger Utility
 *
 * Architecture:
 * - Detects sections marked with .scroll-animate, #hero-section, #about-section, #services-section.
 * - Respects prefers-reduced-motion and gracefully falls back if IntersectionObserver is unsupported.
 * - Applies .js-observe so CSS resets entrance animation states when JS is active.
 * - When a section enters the viewport (~20% visible), triggers its tailored entrance sequence.
 * - When a section leaves the viewport, cleanly resets its entrance animation state.
 * - When the user scrolls back, forces a layout reflow and reapplies .is-visible so animations
 *   reliably replay from the beginning on every single entry.
 * - Keeps sections independent so entering one section never disturbs another visible section.
 * - Threshold hysteresis ([0, 0.05, 0.2]) eliminates any jitter or flapping near viewport boundaries.
 */

(function () {
  'use strict';

  // Ensure refreshing always starts cleanly at the top of the page
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function initScrollAnimationSystem() {
    // Select all animatable sections across the homepage
    var sectionNodeList = document.querySelectorAll(
      '.scroll-animate, #hero-section, #about-section, #services-section, #approach-section'
    );

    // Deduplicate in case an element matches multiple selectors
    var sections = [];
    for (var i = 0; i < sectionNodeList.length; i++) {
      if (sections.indexOf(sectionNodeList[i]) === -1) {
        sections.push(sectionNodeList[i]);
      }
    }

    if (sections.length === 0) return;

    // Accessibility check: Respect prefers-reduced-motion
    var prefersReducedMotion = false;
    if (window.matchMedia) {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Feature detection & Accessibility fallback:
    // If unsupported or reduced motion requested, ensure all content is immediately visible
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      sections.forEach(function (sec) {
        sec.classList.add('is-visible');
      });
      return;
    }

    // Mark sections as JS-observed so CSS handles entrance states & resets
    sections.forEach(function (sec) {
      sec.classList.add('js-observe');
    });

    // Handle initial reveal for sections visible on page load
    // When page loads at the top, only the Hero section reveals immediately.
    // Sections below the viewport do not trigger until the user scrolls into them.
    var isAtTop = window.scrollY <= 50;
    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      var visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

      if (isAtTop) {
        if (sec.id === 'hero-section' || (rect.top >= 0 && rect.top < 120)) {
          sec.classList.add('is-visible');
        }
      } else {
        if (visibleHeight > 0 && visibleHeight / (sec.offsetHeight || 1) >= 0.25) {
          sec.classList.add('is-visible');
        }
      }
    });

    // Unified IntersectionObserver with threshold hysteresis
    var userHasScrolled = window.scrollY > 30;

    window.addEventListener(
      'scroll',
      function () {
        if (!userHasScrolled) {
          userHasScrolled = true;
          // When user begins scrolling, trigger entrance for sections entering view
          sections.forEach(function (sec) {
            if (sec.id !== 'hero-section') {
              var rect = sec.getBoundingClientRect();
              var visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
              if (
                visibleHeight > 0 &&
                (visibleHeight / (sec.offsetHeight || 1) >= 0.18 ||
                  visibleHeight >= window.innerHeight * 0.22)
              ) {
                if (!sec.classList.contains('is-visible')) {
                  void sec.offsetWidth;
                  sec.classList.add('is-visible');
                }
              }
            }
          });
        }
      },
      { passive: true }
    );

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var target = entry.target;

          // On page load at scrollY <= 30, only Hero plays its initial load reveal.
          // Offscreen and lower sections require user scroll interaction.
          if (!userHasScrolled && window.scrollY <= 30 && target.id !== 'hero-section') {
            return;
          }

          // Trigger entrance animations when section enters viewport (~20% visible)
          var isEntering =
            entry.isIntersecting &&
            (entry.intersectionRatio >= 0.18 ||
              (entry.intersectionRect &&
                entry.intersectionRect.height >=
                  Math.min(entry.boundingClientRect.height * 0.18, window.innerHeight * 0.22)));

          // Reset entrance animation state when section leaves the viewport
          var isExiting =
            !entry.isIntersecting ||
            entry.intersectionRatio <= 0.06 ||
            (entry.intersectionRect && entry.intersectionRect.height <= 40);

          if (isEntering) {
            if (!target.classList.contains('is-visible')) {
              // Force synchronous reflow to guarantee the CSS animation starts from 0%
              void target.offsetWidth;
              target.classList.add('is-visible');
            }
          } else if (isExiting) {
            // Reset entrance animation state when leaving viewport
            if (target.classList.contains('is-visible')) {
              target.classList.remove('is-visible');
            }
          }
        });
      },
      {
        threshold: [0, 0.05, 0.1, 0.2]
      }
    );

    // Observe all eligible sections — never unobserve so replay works repeatedly
    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  // Interactive Background Ribbon Motion Controller
  function initInteractiveRibbonController() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var rafId = null;

    function onMouseMove(e) {
      var normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      var normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = normX * 14; // subtle 14px horizontal motion
      targetY = normY * 8;  // subtle 8px vertical motion
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    }

    function animate() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      document.documentElement.style.setProperty(
        '--ribbon-parallax',
        'translate3d(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px, 0)'
      );
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // Initialize once DOM is ready without attaching trigger to window scroll directly
  function init() {
    initScrollAnimationSystem();
    initInteractiveRibbonController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

