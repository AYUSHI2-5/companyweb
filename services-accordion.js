/**
 * Baadam.com - Modern Services Sticky Scroll Accordion Engine
 * Features:
 * - Butter-Smooth Fluid Animation: Hardware-accelerated CSS Grid transition (0fr -> 1fr) with zero layout thrashing
 * - Pinned Sticky Progression: Services section remains pinned at top:0 while scrolling
 * - Stabilized Hysteresis: Directional deadband prevents flutter, jitter, and rapid oscillation at scroll boundaries
 * - Sequential Card Unfolding: Smoothly opens Card 1 -> Card 2 -> Card 3 -> Card 4 -> Card 5 -> Card 6
 * - Symmetric Reverse Scroll: Smoothly steps backward Card 6 -> Card 5 -> Card 4 -> Card 3 -> Card 2 -> Card 1
 * - Click & Tap Navigation: Clicking any card header or stepper segment smoothly scrolls directly to that card
 * - Live Mockup Typing Simulator in search preview bar
 * - Interactive Stepper Counter [ 01 / 06 ] with clickable progress segments
 * - Full Keyboard Accessibility (Arrow keys, Enter, Space)
 */

(function () {
  'use strict';

  function initServicesAccordion() {
    var section = document.getElementById('services-section');
    if (!section) return;

    var track = document.getElementById('services-sticky-track');
    var stack = section.querySelector('.services-accordion-stack');
    var items = Array.prototype.slice.call(section.querySelectorAll('.service-acc-item'));
    var stepperText = section.querySelector('.acc-stepper-counter');
    var stepperSegments = Array.prototype.slice.call(section.querySelectorAll('.acc-stepper-segment'));
    var searchInput = section.querySelector('.mockup-search-input');

    if (items.length === 0) return;

    var currentIndex = 1; // 1-based (1..6)
    var typingTimer = null;
    var isProgrammaticScroll = false;
    var scrollTimer = null;

    // Simulate typing in the SEO search mockup
    function startTypingEffect() {
      if (!searchInput) return;
      var phrases = [
        'full-stack website development',
        'ios & android application engineering',
        'omnichannel digital marketing & growth',
        'custom e-commerce storefronts',
        'scalable enterprise software systems',
        '3d interactive game experiences'
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

    // Activate/open a specific service item with butter-smooth class transition
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
        } else {
          item.classList.remove('is-active');
          if (headerBtn) {
            headerBtn.setAttribute('aria-expanded', 'false');
          }
        }

        // Remove any legacy inline maxHeight styles so CSS Grid drives transition at 60fps
        if (body && body.style.maxHeight) {
          body.style.removeProperty('max-height');
          body.style.removeProperty('opacity');
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
        if (body && body.style.maxHeight) {
          body.style.removeProperty('max-height');
          body.style.removeProperty('opacity');
        }
      });

      if (stepperText) {
        stepperText.innerHTML = '<span class="stepper-badge">01 / 06</span> <span class="stepper-name">Website Development</span>';
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

    // Smoothly scroll window to a specific card step within the sticky track
    function scrollToCard(index) {
      index = Math.max(0, Math.min(items.length - 1, index));
      if (items[index]) {
        activateItem(items[index], false);
      }

      if (track) {
        var vh = window.innerHeight;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        var trackTop = track.getBoundingClientRect().top + scrollY;
        var targetY = trackTop + (index * vh);

        isProgrammaticScroll = true;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });

        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          isProgrammaticScroll = false;
        }, 800);
      }
    }

    // Scroll-driven card activation with directional deadband hysteresis
    function updateCardOnScroll() {
      if (!track || isProgrammaticScroll) return;

      var rect = track.getBoundingClientRect();
      var vh = window.innerHeight;

      // If track is outside viewport range, do not update
      if (rect.top > vh || rect.bottom < 0) return;

      var scrolled = -rect.top;
      var totalScroll = track.offsetHeight - vh;
      if (totalScroll <= 0) return;

      var numItems = items.length;
      var progress = scrolled / vh;
      var current0 = currentIndex > 0 ? (currentIndex - 1) : 0;
      var targetIdx = current0;

      // Clamping at boundaries
      if (progress <= 0.05) {
        targetIdx = 0;
      } else if (progress >= (numItems - 1) - 0.05) {
        targetIdx = numItems - 1;
      } else {
        // Hysteresis deadband: advance only past (current + 0.58), retreat only below (current - 0.58)
        var rawTarget = Math.round(progress);
        rawTarget = Math.max(0, Math.min(numItems - 1, rawTarget));

        if (rawTarget > current0) {
          if (progress > (current0 + 0.58)) {
            targetIdx = rawTarget;
          }
        } else if (rawTarget < current0) {
          if (progress < (current0 - 0.58)) {
            targetIdx = rawTarget;
          }
        }
      }

      if (targetIdx !== current0) {
        if (items[targetIdx]) {
          activateItem(items[targetIdx], false);
        }
      }
    }

    // 60fps RequestAnimationFrame throttled scroll listener
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateCardOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Attach Click and Keyboard listeners to service headers
    items.forEach(function (item, index) {
      var headerBtn = item.querySelector('.service-acc-header');

      // Click anywhere on header or collapsed card navigates to and opens that card
      if (headerBtn) {
        headerBtn.addEventListener('click', function (e) {
          e.preventDefault();
          scrollToCard(index);
        });

        // Accessible Keyboard navigation
        headerBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToCard(index);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            var nextIdx = Math.min(items.length - 1, index + 1);
            scrollToCard(nextIdx);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prevIdx = Math.max(0, index - 1);
            scrollToCard(prevIdx);
          }
        });
      }
    });

    // Stepper segments click
    stepperSegments.forEach(function (seg, segIdx) {
      seg.setAttribute('role', 'button');
      seg.setAttribute('tabindex', '0');
      seg.setAttribute('aria-label', 'Go to service ' + (segIdx + 1));

      seg.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToCard(segIdx);
      });

      seg.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToCard(segIdx);
        }
      });
    });

    // Expose methods for tour / external triggers
    window.BaadamServices = {
      open: function (index) {
        if (items[index]) activateItem(items[index], false);
      },
      scrollToCard: function (index) {
        scrollToCard(index);
      },
      getCurrentIndex: function () {
        return currentIndex > 0 ? (currentIndex - 1) : 0;
      },
      closeAll: deactivateAll
    };

    startTypingEffect();

    // Open first item by default
    if (items.length > 0) {
      activateItem(items[0], false);
    }

    // Sync on resize to maintain correct measurements
    window.addEventListener('resize', function () {
      updateCardOnScroll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesAccordion);
  } else {
    initServicesAccordion();
  }
})();
