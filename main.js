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
        filterBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var filter = btn.getAttribute('data-filter') || 'all';

        // Filter Category Section Containers
        var catSections = document.querySelectorAll('.portfolio-category-section');
        catSections.forEach(function (sec) {
          var secCat = sec.getAttribute('data-category') || '';
          var matchingCards = sec.querySelectorAll('.portfolio-card-item');
          var hasMatch = false;
          matchingCards.forEach(function (mc) {
            var c = (mc.getAttribute('data-category') || '').trim().split(/\s+/);
            if (c.indexOf(filter) !== -1) hasMatch = true;
          });

          if (filter === 'all' || secCat === filter || hasMatch) {
            sec.style.display = '';
            setTimeout(function () { sec.classList.remove('is-hidden'); }, 10);
          } else {
            sec.classList.add('is-hidden');
            setTimeout(function () { sec.style.display = 'none'; }, 250);
          }
        });

        items.forEach(function (item) {
          var category = item.getAttribute('data-category') || '';
          var cats = category.trim().split(/\s+/);
          if (filter === 'all' || cats.indexOf(filter) !== -1) {
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
     7. Contact Form & FAQ Handler (IT Company Contact Page)
     ========================================================================== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var statusMsg = document.getElementById('formStatusMsg');

    // 1. Interactive Multi-Select Service Pills
    var servicePills = document.querySelectorAll('.service-pill');
    var hiddenServicesInput = document.getElementById('selectedServicesInput');

    if (servicePills && hiddenServicesInput) {
      servicePills.forEach(function (pill) {
        pill.addEventListener('click', function (e) {
          e.preventDefault();
          pill.classList.toggle('is-active');

          var selected = [];
          document.querySelectorAll('.service-pill.is-active').forEach(function (activePill) {
            selected.push(activePill.getAttribute('data-value'));
          });
          hiddenServicesInput.value = selected.join(', ');
        });
      });
    }

    // 2. Interactive Contact FAQ Accordion
    var faqButtons = document.querySelectorAll('.contact-faq-btn');
    if (faqButtons) {
      faqButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.contact-faq-item');
          if (!item) return;

          var wasOpen = item.classList.contains('is-open');
          // Close others
          document.querySelectorAll('.contact-faq-item').forEach(function (other) {
            other.classList.remove('is-open');
            var otherBtn = other.querySelector('.contact-faq-btn');
            if (otherBtn) {
              otherBtn.setAttribute('aria-expanded', 'false');
              var icon = otherBtn.querySelector('.faq-icon');
              if (icon) icon.innerHTML = '&plus;';
            }
          });

          if (!wasOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            var icon = btn.querySelector('.faq-icon');
            if (icon) icon.innerHTML = '&minus;';
          }
        });
      });
    }

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var name = (form.querySelector('#contactName') || {}).value || '';
      var email = (form.querySelector('#contactEmail') || {}).value || '';
      var phone = (form.querySelector('#contactPhone') || {}).value || '';
      var company = (form.querySelector('#contactCompany') || {}).value || '';
      var budget = (form.querySelector('#contactBudget') || {}).value || '';
      var timeline = (form.querySelector('#contactTimeline') || {}).value || '';
      var message = (form.querySelector('#contactMessage') || {}).value || '';
      var ndaCheckbox = form.querySelector('#ndaCheckbox');
      var isNdaRequested = ndaCheckbox ? ndaCheckbox.checked : false;

      if (!name.trim() || !email.trim() || !message.trim()) {
        if (statusMsg) {
          statusMsg.className = 'form-status is-error';
          statusMsg.innerHTML = '<strong>Incomplete Brief:</strong> Please provide your Full Name, Work Email, and Project Description.';
          statusMsg.style.display = 'block';
        }
        return;
      }

      // Email format validation
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        if (statusMsg) {
          statusMsg.className = 'form-status is-error';
          statusMsg.innerHTML = '<strong>Invalid Email:</strong> Please enter a valid corporate or work email address.';
          statusMsg.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Technical Brief...</span>';
      }

      // Simulate clean asynchronous submission with realistic feedback
      setTimeout(function () {
        if (statusMsg) {
          statusMsg.className = 'form-status is-success';
          var ndaNote = isNdaRequested ? ' <span style="display:block;margin-top:4px;color:#15803d;">&#x1F512; A mutual Non-Disclosure Agreement (NDA) will be prepared prior to our discovery meeting.</span>' : '';
          statusMsg.innerHTML = '<strong>Technical Inquiry Received, ' + escapeHtml(name) + '!</strong> Our engineering lead in Ahmedabad will analyze your project scope and follow up within 24 hours.' + ndaNote;
          statusMsg.style.display = 'block';
          statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        document.querySelectorAll('.service-pill.is-active').forEach(function (pill) {
          pill.classList.remove('is-active');
        });
        if (hiddenServicesInput) hiddenServicesInput.value = '';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Technical Inquiry</span><span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>';
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
     8. Full-Page Section Snap Navigation & Active Tracking
     ========================================================================== */
  function initSectionSnapNav() {
    var snapNav = document.querySelector('.screen-snap-nav');
    if (!snapNav) return;

    var dots = Array.from(snapNav.querySelectorAll('.snap-nav-dot'));
    if (!dots.length) return;

    var sectionIds = dots.map(function (dot) {
      return dot.getAttribute('data-section') || (dot.getAttribute('href') ? dot.getAttribute('href').replace('#', '') : '');
    });

    var sections = sectionIds.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    function setActiveDot(targetId) {
      dots.forEach(function (dot) {
        var dotSec = dot.getAttribute('data-section') || (dot.getAttribute('href') ? dot.getAttribute('href').replace('#', '') : '');
        if (dotSec === targetId) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.removeAttribute('aria-current');
        }
      });
    }

    // Dot click smooth scroll
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        var targetId = dot.getAttribute('data-section') || (dot.getAttribute('href') ? dot.getAttribute('href').replace('#', '') : '');
        var targetSec = document.getElementById(targetId);
        if (targetSec) {
          e.preventDefault();
          if (targetId === 'services-section') {
            var track = document.getElementById('services-sticky-track') || targetSec;
            track.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.BaadamServices && typeof window.BaadamServices.open === 'function') {
              window.BaadamServices.open(0);
            }
          } else {
            targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setActiveDot(targetId);
          if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
          }
        }
      });
    });

    // IntersectionObserver to sync active dot with scroll
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setActiveDot(entry.target.id);
          }
        });
      }, {
        threshold: [0.45, 0.7]
      });

      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }

    // Keyboard Up / Down arrow navigation between 100vh sections (with sticky card stepping)
    window.addEventListener('keydown', function (e) {
      // Don't intercept if user is typing in form inputs/textarea
      var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        var vh = window.innerHeight;
        var servicesTrack = document.getElementById('services-sticky-track');

        // Check if user is currently viewing the sticky services section
        if (servicesTrack) {
          var trackRect = servicesTrack.getBoundingClientRect();
          if (trackRect.top <= 80 && trackRect.bottom >= vh - 80) {
            var currentCard = (window.BaadamServices && typeof window.BaadamServices.getCurrentIndex === 'function')
              ? window.BaadamServices.getCurrentIndex()
              : -1;

            if (currentCard >= 0) {
              if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                if (currentCard < 5) {
                  e.preventDefault();
                  window.BaadamServices.scrollToCard(currentCard + 1);
                  return;
                }
                // If on last card (index 5), allow down arrow to naturally progress to next section
              } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                if (currentCard > 0) {
                  e.preventDefault();
                  window.BaadamServices.scrollToCard(currentCard - 1);
                  return;
                }
                // If on first card (index 0), allow up arrow to naturally retreat to previous section
              }
            }
          }
        }

        var currentActiveIndex = -1;

        for (var i = 0; i < sections.length; i++) {
          var rect = sections[i].getBoundingClientRect();
          if (rect.top <= vh * 0.4 && rect.bottom >= vh * 0.4) {
            currentActiveIndex = i;
            break;
          }
        }

        if (currentActiveIndex === -1) {
          currentActiveIndex = 0;
        }

        var nextIndex = currentActiveIndex;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          nextIndex = Math.min(sections.length - 1, currentActiveIndex + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          nextIndex = Math.max(0, currentActiveIndex - 1);
        }

        if (nextIndex !== currentActiveIndex) {
          e.preventDefault();
          if (sections[nextIndex].id === 'services-section' && servicesTrack) {
            servicesTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.BaadamServices && typeof window.BaadamServices.open === 'function') {
              window.BaadamServices.open(0);
            }
          } else {
            sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setActiveDot(sections[nextIndex].id);
        }
      }
    });
  }

  /* ==========================================================================
     9. AI Teacher / Presenter Scrolling Kinematics Engine
     - Bottom-left stationary teacher avatar facing classroom board
     - Smooth 60fps kinematic solver with Lerp/Spring physics
     - Multi-layer independent articulation:
       1. Arm Layer: Pinned at sleeve cuff socket (84.8% 43.7%), rotates to point at content
       2. Wrist Layer: Pinned at knuckle socket (86% 36%), handles explaining orbits & highlighting flicks
       3. Posture Layer: Pinned at hem base (30% 98%), tilts head & gaze toward active presentation content
     - Bidirectional scroll follow:
       - Upward scroll: Arm lifts up smoothly, head tilts up toward rising content
       - Downward scroll: Arm follows content down, head lowers gaze naturally
     - Section Highlighting: On entering new section, raises hand to point at its heading
     - Organic Explaining Mode: When scrolling stops, wrist & stylus trace subtle explaining orbits
     - Zero whole-body jitter or page translation
     ========================================================================== */
  function initAutoScrollTour() {
    var isSnapHomepage = document.body.classList.contains('has-snap-nav') || !!document.querySelector('.screen-snap-nav');

    var tourSections = [
      { id: 'hero-section', name: 'Overview', duration: 7500 },
      { id: 'radar-section', name: 'Brand Radar', duration: 8000 },
      { id: 'services-section', name: 'Our Services', duration: 8500 },
      { id: 'portfolio-showcase-section', name: 'Featured Work', duration: 8500 },
      { id: 'case-studies-section', name: 'Case Studies', duration: 8000 },
      { id: 'funnel-section', name: 'How We Work', duration: 8000 },
      { id: 'cta-section', name: 'Start Project', duration: 7000 },
      { id: 'site-footer', name: 'Footer', duration: 6500 }
    ].filter(function (item) {
      return document.getElementById(item.id) !== null;
    });

    // On inner pages (About, Services, Portfolio, Contact), detect the page sections dynamically:
    if (tourSections.length < 2) {
      var detectedSections = document.querySelectorAll('main > section, .site-main > section, section, footer');
      tourSections = [];
      detectedSections.forEach(function (sec, idx) {
        if (!sec.id) sec.id = 'page-sec-' + idx;
        tourSections.push({
          id: sec.id,
          name: sec.getAttribute('aria-label') || ('Section ' + (idx + 1)),
          duration: 8000
        });
      });
    }

    if (!document.getElementById('teacherGuideWidget') || tourSections.length < 1) return;

    var teacherWidget = document.getElementById('teacherGuideWidget');
    var teacherAvatarWrapper = document.getElementById('teacherAvatarWrapper');
    var teacherArmLayer = document.getElementById('teacherArmLayer');
    var teacherWristLayer = document.getElementById('teacherWristLayer');
    var teacherSpeech = document.getElementById('teacherSpeechText');

    // Continuous scroll progress (0.0 at top of document to 1.0 at bottom)
    function getNormalizedScrollProgress() {
      var doc = document.documentElement;
      var body = document.body;
      var scrollEl = document.scrollingElement || doc || body;

      var scrollTop = window.pageYOffset !== undefined
        ? window.pageYOffset
        : (scrollEl && scrollEl.scrollTop !== undefined ? scrollEl.scrollTop : (doc.scrollTop || body.scrollTop || 0));

      var scrollHeight = Math.max(
        doc ? doc.scrollHeight : 0,
        body ? body.scrollHeight : 0,
        scrollEl ? scrollEl.scrollHeight : 0
      );

      var clientHeight = window.innerHeight || (doc ? doc.clientHeight : 0) || (body ? body.clientHeight : 0) || 1;
      var maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return 0;
      return Math.max(0, Math.min(1, scrollTop / maxScroll));
    }

    // Kinematic state variables
    var currentArmAngle = -16.0;
    var targetArmAngle = -16.0;
    var currentWristAngle = 0.0;
    var targetWristAngle = 0.0;

    var wristOrbitX = 0;
    var wristOrbitY = 0;
    var velocityImpulse = 0;
    var highlightImpulse = 0;
    var cueImpulse = 0;

    var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var lastScrollTime = performance.now();
    var lastScrollMoveTime = performance.now();
    var currentActiveSectionIndex = 0;
    var previousActiveSectionIndex = -1;

    // Detect section with dominant presence in viewport
    function getDominantVisibleSection() {
      var vh = window.innerHeight;
      var bestIdx = 0;
      var bestScore = -1;

      for (var i = 0; i < tourSections.length; i++) {
        var el = document.getElementById(tourSections[i].id);
        if (el) {
          var rect = el.getBoundingClientRect();
          var visibleH = Math.max(0, Math.min(vh, rect.bottom) - Math.max(0, rect.top));
          // Weight earlier parts of section higher for responsive transitions
          var score = visibleH * (1 + (1 - Math.max(0, Math.min(1, rect.top / vh))));
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }
      }
      return bestIdx;
    }

    // Compute direct geometric pointing ray toward active section content
    function calculateTargetPointingRay() {
      var vh = window.innerHeight || 800;
      var activeIdx = getDominantVisibleSection();
      currentActiveSectionIndex = activeIdx;

      // Detect section change to trigger teacher highlighting gesture
      if (currentActiveSectionIndex !== previousActiveSectionIndex) {
        if (previousActiveSectionIndex !== -1) {
          // Highlight impulse: swift anticipation lift & wrist emphasis
          highlightImpulse = (currentActiveSectionIndex > previousActiveSectionIndex) ? 6.5 : -6.5;
        }
        previousActiveSectionIndex = currentActiveSectionIndex;
      }

      var activeEl = document.getElementById(tourSections[activeIdx].id);
      var progress = getNormalizedScrollProgress();

      // Base anatomical progression: -18deg at top hero to +16deg at bottom footer
      var baseProgressAngle = -18.0 + (progress * 34.0);

      if (activeEl) {
        var rect = activeEl.getBoundingClientRect();
        // Point toward section heading (approx 20% down section height)
        var targetY = rect.top + Math.min(180, Math.max(40, rect.height * 0.2));
        var shoulderY = vh - 120;
        var dy = targetY - shoulderY;
        // Ray angle: negative = pointing up, positive = pointing down
        var rayAngle = (dy / vh) * 28.0;
        // Blend ray with progress angle for natural anatomical flow
        return (baseProgressAngle * 0.45) + (rayAngle * 0.55);
      }

      return baseProgressAngle;
    }

    // Main 60fps Teacher Presenter Kinematics Loop
    var isInitialized = false;

    function updateTeacherPresenterLoop() {
      var now = performance.now();
      var timeSinceScroll = now - lastScrollMoveTime;
      var isIdleExplaining = timeSinceScroll > 550; // Stopped scrolling -> start explaining

      // 1. Calculate Target Pointing Angle
      var basePointingAngle = calculateTargetPointingRay();

      // Smooth decay of dynamic impulses
      velocityImpulse *= 0.86;
      highlightImpulse *= 0.90;
      cueImpulse *= 0.92;

      // 2. Explaining State & Ambient Breathing
      var explainingSway = 0;

      if (isIdleExplaining) {
        // Teacher Explaining Gesture: Gentle organic micro-sway with stylus pointing
        var phase = (now - lastScrollMoveTime - 550) * 0.0022;
        explainingSway = Math.sin(phase) * 1.5;
      }

      // Natural subtle breathing sway (±0.35deg)
      var naturalBreath = Math.sin(now * 0.0016) * 0.35;

      // Final target angle
      targetArmAngle = basePointingAngle + velocityImpulse + highlightImpulse + cueImpulse + explainingSway + naturalBreath;
      // Anatomical socket clamp: -14.0deg (high headline point) to +8.0deg (low content point)
      targetArmAngle = Math.max(-14.0, Math.min(8.0, targetArmAngle));

      // 3. Smooth Damped Spring / Lerp Integration
      if (!isInitialized) {
        currentArmAngle = targetArmAngle;
        isInitialized = true;
      } else {
        // Responsive Lerp damping
        currentArmAngle += (targetArmAngle - currentArmAngle) * 0.16;
      }

      // 4. Apply Transforms Only to Arm Layer (Body remains 100% motionless, wrist translation = 0)
      if (teacherArmLayer) {
        teacherArmLayer.style.transform = 'rotate(' + currentArmAngle.toFixed(2) + 'deg)';
      }

      if (teacherWristLayer) {
        teacherWristLayer.style.transform = 'none';
      }

      requestAnimationFrame(updateTeacherPresenterLoop);
    }

    if (teacherArmLayer) {
      requestAnimationFrame(updateTeacherPresenterLoop);
    }

    // Auto-fade teacher guide widget when viewing interactive maps (unobstructed map browsing)
    var locationMapEl = document.getElementById('location-map');
    if (locationMapEl && teacherWidget) {
      function checkMapCollision() {
        var rect = locationMapEl.getBoundingClientRect();
        var vh = window.innerHeight;
        if (rect.top < vh - 60 && rect.bottom > 80) {
          teacherWidget.style.opacity = '0';
          teacherWidget.style.pointerEvents = 'none';
        } else {
          teacherWidget.style.opacity = '1';
          teacherWidget.style.pointerEvents = 'auto';
        }
      }
      window.addEventListener('scroll', checkMapCollision, { passive: true });
      window.addEventListener('resize', checkMapCollision, { passive: true });
      checkMapCollision();
    }

    function setTeacherSpeech(text) {
      if (teacherSpeech) {
        teacherSpeech.textContent = text;
      }
    }

    // Respect user reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var currentIndex = 0;
    var advanceTimeout = null;
    var gestureTimeout = null;
    var idleTimeout = null;
    var serviceSubTimeout = null;
    var isUserScrolling = false;
    var IDLE_RESUME_DELAY = 8500; // 8.5 seconds of dwell before tour advances

    function clearScheduledTimers() {
      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
        advanceTimeout = null;
      }
      if (gestureTimeout) {
        clearTimeout(gestureTimeout);
        gestureTimeout = null;
      }
      if (serviceSubTimeout) {
        clearTimeout(serviceSubTimeout);
        serviceSubTimeout = null;
      }
    }

    function triggerSectionAnimation(index) {
      var target = tourSections[index];
      if (!target) return;

      if (target.id === 'services-section' && window.BaadamServices) {
        serviceSubTimeout = setTimeout(function () {
          if (isUserScrolling) return;
          window.BaadamServices.open(0);
          serviceSubTimeout = setTimeout(function () {
            if (isUserScrolling) return;
            window.BaadamServices.open(1);
          }, 3600);
        }, 1200);
      }
    }

    function scrollToSection(index) {
      if (index < 0 || index >= tourSections.length) return;
      currentIndex = index;
      var target = tourSections[index];
      var el = document.getElementById(target.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      triggerSectionAnimation(index);
      scheduleNext(index);
    }

    // Programmatic auto-scroll cue
    var isProgrammaticScrolling = false;

    function performTeacherScrollCue(nextIdx) {
      if (isUserScrolling) return;

      var isScrollingUp = nextIdx < currentIndex;
      // Anticipation wind-up: raise hand slightly before the swipe down
      cueImpulse = isScrollingUp ? 6.0 : -6.0;

      gestureTimeout = setTimeout(function () {
        if (isUserScrolling) return;

        // Expressive swipe gesture in the scroll direction
        cueImpulse = isScrollingUp ? -12.0 : 12.0;
        isProgrammaticScrolling = true;
        scrollToSection(nextIdx);

        setTimeout(function () {
          isProgrammaticScrolling = false;
        }, 1200);
      }, 450);
    }

    function scheduleNext(fromIndex) {
      if (!isSnapHomepage) return;
      clearScheduledTimers();
      if (isUserScrolling) return;

      var currentSection = tourSections[fromIndex];
      var duration = currentSection ? currentSection.duration : 7500;
      var cueOffset = 900;

      advanceTimeout = setTimeout(function () {
        if (isUserScrolling) return;
        var nextIdx = fromIndex + 1;
        if (nextIdx >= tourSections.length) {
          advanceTimeout = setTimeout(function () {
            if (isUserScrolling) return;
            performTeacherScrollCue(0);
          }, 8000);
        } else {
          performTeacherScrollCue(nextIdx);
        }
      }, Math.max(1000, duration - cueOffset));
    }

    // Manual user interaction handler
    function onUserInteraction() {
      isUserScrolling = true;
      clearScheduledTimers();

      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }

      idleTimeout = setTimeout(function () {
        isUserScrolling = false;
        var visibleIndex = getDominantVisibleSection();
        currentIndex = visibleIndex;
        triggerSectionAnimation(currentIndex);
        scheduleNext(currentIndex);
      }, IDLE_RESUME_DELAY);
    }

    // Passive listeners for natural manual scrolling
    window.addEventListener('wheel', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });
    window.addEventListener('touchmove', onUserInteraction, { passive: true });

    // Real-time dynamic hand gesture reaction on scroll
    window.addEventListener('scroll', function () {
      var now = performance.now();
      var st = window.pageYOffset || document.documentElement.scrollTop || 0;
      var dt = Math.max(10, now - lastScrollTime);
      var delta = st - lastScrollTop;
      lastScrollTop = st;
      lastScrollTime = now;
      lastScrollMoveTime = now;

      // Active pointing impulse: when scrolling down, hand dips down to lead view; when scrolling up, hand lifts up
      var impulse = (delta / dt) * 0.55;
      velocityImpulse += impulse;
      velocityImpulse = Math.max(-10.0, Math.min(10.0, velocityImpulse));

      if (!isProgrammaticScrolling) {
        onUserInteraction();
      }
    }, { passive: true });

    window.addEventListener('keydown', function (e) {
      var keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Space'];
      if (keys.indexOf(e.key) !== -1 || keys.indexOf(e.code) !== -1) {
        onUserInteraction();
      }
    });

    document.querySelectorAll('.snap-nav-dot, .nav-link, .hero-btn-dark, .hero-btn-glass, .btn, .cta-btn-primary').forEach(function (el) {
      el.addEventListener('click', onUserInteraction);
    });

    // Interactive Teacher Click: advance to next section on click
    if (teacherWidget) {
      teacherWidget.addEventListener('click', function (e) {
        e.stopPropagation();
        var nextIdx = (currentIndex + 1) % tourSections.length;
        if (isSnapHomepage) {
          clearScheduledTimers();
          isUserScrolling = false;
          performTeacherScrollCue(nextIdx);
        } else {
          var targetEl = document.getElementById(tourSections[nextIdx].id);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    if (isSnapHomepage) {
      setTimeout(function () {
        if (!isUserScrolling) {
          currentIndex = getDominantVisibleSection();
          triggerSectionAnimation(currentIndex);
          scheduleNext(currentIndex);
        }
      }, 1800);
    }
  }

  /* ==========================================================================
     9.5. Interactive Card Spotlight Glow Tracking
     ========================================================================== */
  function initCardSpotlights() {
    var cards = document.querySelectorAll('.service-showcase-card');
    if (!cards || cards.length === 0) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  /* ==========================================================================
     9.6. Interactive 3D Card Tilt for Featured Portfolio
     ========================================================================== */
  function initPortfolio3DTilt() {
    var cards = document.querySelectorAll('.portfolio-feature-card');
    if (!cards || cards.length === 0) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* ==========================================================================
     10. Initialize All Components on DOM Ready
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initPageTransitions();
    initNavigation();
    initScrollReveals();
    initCounters();
    initTeamCarousel();
    initPortfolioFilter();
    initContactForm();
    initSectionSnapNav();
    initAutoScrollTour();
    initCardSpotlights();
    initPortfolio3DTilt();
  });
})();
