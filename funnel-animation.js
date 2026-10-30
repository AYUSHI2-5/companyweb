/**
 * Funnel Section Sequential JS Animation Engine
 * Recreates the Reachwise (04) "How we work - From attention to clients" interactive funnel.
 * Features:
 * - IntersectionObserver scroll trigger
 * - Smooth Ease-Out Animated Numeric Counters with comma formatting
 * - Staggered progressive width bar expansion with glowing brand red edges
 * - Micro-interaction hover depth states
 */

(function () {
  'use strict';

  function initFunnelAnimation() {
    var section = document.getElementById('funnel-section');
    if (!section) return;

    var cards = Array.prototype.slice.call(section.querySelectorAll('.funnel-card'));
    var progressBars = Array.prototype.slice.call(section.querySelectorAll('.funnel-progress-bar'));
    var statNumbers = Array.prototype.slice.call(section.querySelectorAll('.funnel-stat-num'));

    // Animated counter with easing
    function animateCounter(el, target, duration) {
      var startTime = null;
      var startVal = 0;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic: 1 - pow(1 - progress, 3)
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(startVal + (target - startVal) * ease);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(step);
    }

    // Trigger animations sequentially
    var hasAnimated = false;
    function triggerFunnel() {
      if (hasAnimated) return;
      hasAnimated = true;

      // Animate progress bars with staggered delay
      progressBars.forEach(function (bar, idx) {
        var targetWidth = bar.getAttribute('data-width') || '100%';
        setTimeout(function () {
          bar.style.width = targetWidth;
        }, 120 + idx * 180);
      });

      // Animate counter numbers
      statNumbers.forEach(function (statEl, idx) {
        var targetNum = parseInt(statEl.getAttribute('data-target'), 10) || 0;
        setTimeout(function () {
          animateCounter(statEl, targetNum, 1400);
        }, 100 + idx * 160);
      });
    }

    // IntersectionObserver to start animation on scroll into view
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          triggerFunnel();
          observer.unobserve(section);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(section);

    // Initial state: reset bars to 0% width until triggered
    progressBars.forEach(function (bar) {
      bar.style.width = '0%';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFunnelAnimation);
  } else {
    initFunnelAnimation();
  }
})();
