/**
 * Baadam.com - Modern Services Hover Accordion Engine
 * Features:
 * - Hover to open: moving cursor over any service pill smoothly expands it
 * - Mouseleave to close: moving cursor away closes that particular service dropdown
 * - Clean UI: Removed + and - toggle buttons per user request
 * - Dynamic height & opacity transitions with requestAnimationFrame
 * - Interactive Mockup: Live typing simulator in search bar
 * - Bottom stepper progress bar with clickable segment pills and [ 01 / 06 ] counter
 * - Full keyboard navigation (Arrow keys, Enter, Space, Escape) and accessibility
 */

(function () {
  'use strict';

  function initServicesAccordion() {
    var section = document.getElementById('services-section');
    if (!section) return;

    var stack = section.querySelector('.services-accordion-stack');
    var items = Array.prototype.slice.call(section.querySelectorAll('.service-acc-item'));
    var stepperText = section.querySelector('.acc-stepper-counter');
    var stepperSegments = Array.prototype.slice.call(section.querySelectorAll('.acc-stepper-segment'));
    var searchInput = section.querySelector('.mockup-search-input');

    if (items.length === 0) return;

    var currentIndex = -1;
    var typingTimer = null;
    var closeTimer = null;

    // Simulate typing in the SEO search mockup
    function startTypingEffect() {
      if (!searchInput) return;
      var phrases = [
        'full-stack website development',
        'ios & android application engineering',
        'omnichannel digital marketing & growth',
        'custom b2b/d2c ecommerce platforms',
        'enterprise cloud software & microservices',
        'cross-platform 3d game development'
      ];
      var phraseIdx = 0;
      var charIdx = 0;
      var isDeleting = false;

      function typeLoop() {
        var currentPhrase = phrases[phraseIdx];
        if (isDeleting) {
          charIdx--;
          searchInput.setAttribute('placeholder', currentPhrase.substring(0, charIdx) + '|');
          if (charIdx <= 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingTimer = setTimeout(typeLoop, 500);
            return;
          }
          typingTimer = setTimeout(typeLoop, 45);
        } else {
          charIdx++;
          searchInput.setAttribute('placeholder', currentPhrase.substring(0, charIdx) + '|');
          if (charIdx === currentPhrase.length) {
            isDeleting = true;
            typingTimer = setTimeout(typeLoop, 2200);
            return;
          }
          typingTimer = setTimeout(typeLoop, 85);
        }
      }

      clearTimeout(typingTimer);
      typingTimer = setTimeout(typeLoop, 800);
    }

    // Activate/open a specific service item
    function activateItem(targetItem, shouldFocus) {
      if (!targetItem) return;

      var targetIdx = parseInt(targetItem.getAttribute('data-index'), 10) || 1;
      currentIndex = targetIdx;
      var serviceName = targetItem.getAttribute('data-name') || '';

      items.forEach(function (item) {
        var isTarget = (item === targetItem);
        var headerBtn = item.querySelector('.service-acc-header');
        var body = item.querySelector('.service-acc-body');

        if (isTarget) {
          item.classList.add('is-active');
          if (headerBtn) {
            headerBtn.setAttribute('aria-expanded', 'true');
            if (shouldFocus) headerBtn.focus();
          }
          if (body) {
            // Fluid height expansion
            body.style.maxHeight = (body.scrollHeight + 140) + 'px';
            body.style.opacity = '1';
          }
        } else {
          item.classList.remove('is-active');
          if (headerBtn) {
            headerBtn.setAttribute('aria-expanded', 'false');
          }
          if (body) {
            body.style.maxHeight = '0px';
            body.style.opacity = '0';
          }
        }
      });

      // Update bottom stepper counter
      if (stepperText) {
        var paddedIdx = targetIdx < 10 ? '0' + targetIdx : targetIdx;
        stepperText.innerHTML = '<span class="stepper-badge">' + paddedIdx + ' / 06</span> <span class="stepper-name">' + escapeHtml(serviceName) + '</span>';
      }

      // Update stepper track segments
      if (stepperSegments.length > 0) {
        stepperSegments.forEach(function (seg, i) {
          if (i === (targetIdx - 1)) {
            seg.classList.add('is-active');
            seg.setAttribute('aria-current', 'step');
          } else {
            seg.classList.remove('is-active');
            seg.removeAttribute('aria-current');
          }
        });
      }
    }

    // Deactivate/close all service items
    function deactivateAll() {
      currentIndex = -1;
      items.forEach(function (item) {
        item.classList.remove('is-active');
        var headerBtn = item.querySelector('.service-acc-header');
        var body = item.querySelector('.service-acc-body');
        if (headerBtn) {
          headerBtn.setAttribute('aria-expanded', 'false');
        }
        if (body) {
          body.style.maxHeight = '0px';
          body.style.opacity = '0';
        }
      });

      if (stepperText) {
        stepperText.innerHTML = '<span class="stepper-badge">01 / 06</span> <span class="stepper-name">Hover to explore</span>';
      }

      stepperSegments.forEach(function (seg) {
        seg.classList.remove('is-active');
        seg.removeAttribute('aria-current');
      });
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Attach Hover (mouseenter) and Leave (mouseleave) event listeners
    items.forEach(function (item, index) {
      var headerBtn = item.querySelector('.service-acc-header');

      // 1. Hover to open this service card smoothly
      item.addEventListener('mouseenter', function () {
        activateItem(item, false);
      });

      if (headerBtn) {
        // Also support click to toggle
        headerBtn.addEventListener('click', function () {
          if (item.classList.contains('is-active')) {
            deactivateAll();
          } else {
            activateItem(item, false);
          }
        });

        // Accessible Keyboard navigation
        headerBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (item.classList.contains('is-active')) {
              deactivateAll();
            } else {
              activateItem(item, true);
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            var nextIdx = (index + 1) % items.length;
            activateItem(items[nextIdx], true);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prevIdx = (index - 1 + items.length) % items.length;
            activateItem(items[prevIdx], true);
          } else if (e.key === 'Escape') {
            deactivateAll();
          }
        });
      }
    });

    // Preserve active card on stack mouseleave so other cards remain neatly visible

    // Stepper segments click / hover
    stepperSegments.forEach(function (seg, segIdx) {
      seg.setAttribute('role', 'button');
      seg.setAttribute('tabindex', '0');
      seg.setAttribute('aria-label', 'Go to service ' + (segIdx + 1));

      seg.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        if (items[segIdx]) activateItem(items[segIdx], false);
      });

      seg.addEventListener('click', function () {
        if (items[segIdx]) activateItem(items[segIdx], false);
      });

      seg.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (items[segIdx]) activateItem(items[segIdx], true);
        }
      });
    });

    // Expose methods for tour / external triggers
    window.BaadamServices = {
      open: function (index) {
        if (items[index]) activateItem(items[index], false);
      },
      closeAll: deactivateAll
    };

    startTypingEffect();

    // Open first item by default so content is immediately visible without awkward blank state
    if (items.length > 0) {
      activateItem(items[0], false);
    }

    // Recalculate on window resize to preserve smooth heights
    window.addEventListener('resize', function () {
      var active = section.querySelector('.service-acc-item.is-active .service-acc-body');
      if (active) {
        active.style.maxHeight = (active.scrollHeight + 140) + 'px';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesAccordion);
  } else {
    initServicesAccordion();
  }
})();
