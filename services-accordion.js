/**
 * Baadam.com - Reachwise Reference Services Accordion Engine
 * Recreates the exact multi-state interactive accordion from the user's reference design.
 * Features:
 * - Expanding active card (#DFE0D7) with interactive UI mockup, deliverables, and metrics
 * - Multi-colored collapsed pill rows (Dark #0D0E10, White #FFFFFF, Lime #D4FF3A)
 * - Smooth CSS height & opacity transitions with requestAnimationFrame
 * - Interactive Mockup: Live typing simulator in search bar + interactive pills
 * - Bottom stepper progress bar with clickable segment pills and [ 01 / 06 ] counter
 * - Keyboard navigation (Arrow keys, Enter, Space) and ARIA expanded states
 */

(function () {
  'use strict';

  function initServicesAccordion() {
    var section = document.getElementById('services-section');
    if (!section) return;

    var items = Array.prototype.slice.call(section.querySelectorAll('.service-acc-item'));
    var stepperText = section.querySelector('.acc-stepper-counter');
    var stepperSegments = Array.prototype.slice.call(section.querySelectorAll('.acc-stepper-segment'));
    var searchInput = section.querySelector('.mockup-search-input');
    var searchResultTitle = section.querySelector('.mockup-result-main .mockup-res-title');

    if (items.length === 0) return;

    var currentIndex = 1;
    var typingTimer = null;

    // Simulate typing in the SEO search mockup
    function startTypingEffect() {
      if (!searchInput) return;
      var phrases = [
        'dentist near me',
        'top digital agency ahmedabad',
        'high conversion web design',
        'ecommerce optimization'
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

    // Activate item by index (1-based) or DOM element
    function activateItem(targetItem, shouldFocus) {
      if (!targetItem) return;

      var targetIdx = parseInt(targetItem.getAttribute('data-index'), 10) || 1;
      currentIndex = targetIdx;
      var serviceName = targetItem.getAttribute('data-name') || '';

      items.forEach(function (item) {
        var isTarget = item === targetItem;
        var headerBtn = item.querySelector('.service-acc-header');
        var body = item.querySelector('.service-acc-body');
        var toggleIcon = item.querySelector('.acc-toggle-icon');

        if (isTarget) {
          item.classList.add('is-active');
          if (headerBtn) {
            headerBtn.setAttribute('aria-expanded', 'true');
            if (shouldFocus) headerBtn.focus();
          }
          if (body) {
            // Recalculate dynamic scrollHeight for fluid expansion
            body.style.maxHeight = body.scrollHeight + 140 + 'px';
            body.style.opacity = '1';
          }
          if (toggleIcon) {
            toggleIcon.textContent = '−';
            toggleIcon.setAttribute('aria-label', 'Collapse section');
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
          if (toggleIcon) {
            toggleIcon.textContent = '+';
            toggleIcon.setAttribute('aria-label', 'Expand section');
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

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Attach click and keyboard listeners to items
    items.forEach(function (item, index) {
      var headerBtn = item.querySelector('.service-acc-header');
      if (headerBtn) {
        headerBtn.addEventListener('click', function (e) {
          // If clicked while active, keep active (per reference UI behavior where one service is always highlighted)
          activateItem(item, false);
        });

        headerBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateItem(item, true);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            var nextIdx = (index + 1) % items.length;
            activateItem(items[nextIdx], true);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prevIdx = (index - 1 + items.length) % items.length;
            activateItem(items[prevIdx], true);
          }
        });
      }
    });

    // Make bottom stepper segments clickable
    stepperSegments.forEach(function (seg, segIdx) {
      seg.addEventListener('click', function () {
        if (items[segIdx]) {
          activateItem(items[segIdx], false);
        }
      });
      seg.setAttribute('role', 'button');
      seg.setAttribute('tabindex', '0');
      seg.setAttribute('aria-label', 'Go to service ' + (segIdx + 1));
      seg.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (items[segIdx]) activateItem(items[segIdx], true);
        }
      });
    });

    // Initial activation of item 1
    activateItem(items[0], false);
    startTypingEffect();

    // Recalculate on window resize to preserve smooth heights
    window.addEventListener('resize', function () {
      var active = section.querySelector('.service-acc-item.is-active .service-acc-body');
      if (active) {
        active.style.maxHeight = active.scrollHeight + 140 + 'px';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesAccordion);
  } else {
    initServicesAccordion();
  }
})();
