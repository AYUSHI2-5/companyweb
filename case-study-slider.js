/**
 * Interactive Case Studies Comparison Slider & Tab Animation Engine
 * Recreates the exact Reachwise "Results you can count" section from the reference design.
 * Features:
 * - Interactive Draggable Split Handle revealing Before (grayscale) and After (full color)
 * - Horizontal Client Tabs switcher with smooth cross-fades
 * - Animated counter for Before and After numerical metrics
 * - Animated SVG growth trajectory curve (stroke-dashoffset draw)
 * - Touch and mouse pointer drag support with bounds clamping
 * - Keyboard navigation (ArrowLeft, ArrowRight)
 */

(function () {
  'use strict';

  var clientsData = [
    {
      id: 'northside',
      name: 'Northside Dental',
      statRange: '4,200 → 38,900',
      clientMeta: 'DENTAL CLINIC · 2025',
      headline: 'From page 4 to the top 3 for "dentist near me"',
      description: 'A local SEO rebuild: 60 location pages, 180 reviews and a content plan for every treatment.',
      metricLabel: 'ORGANIC VISITS A MONTH',
      beforeNum: 4200,
      afterNum: 38900,
      beforeDisplay: '4,200',
      afterDisplay: '38,900',
      tags: ['SEO', 'Content'],
      image: 'assets/case-dental-clinic.jpg',
      curvePath: 'M0,130 C120,130 180,115 280,85 C380,55 440,25 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'kettlebrook',
      name: 'Kettlebrook Coffee',
      statRange: '8,100 → 96,400',
      clientMeta: 'SPECIALTY COFFEE ROASTERS · 2025',
      headline: 'Direct-to-consumer subscription scale with 4.8x ROAS',
      description: 'Custom headless Shopify storefront and retention funnel scaling repeat monthly subscription orders by 320%.',
      metricLabel: 'MONTHLY ONLINE ORDERS',
      beforeNum: 8100,
      afterNum: 96400,
      beforeDisplay: '8,100',
      afterDisplay: '96,400',
      tags: ['E-Commerce', 'Paid Ads'],
      image: 'assets/case-coffee-roastery.jpg',
      curvePath: 'M0,135 C100,135 220,120 320,70 C400,30 490,15 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'fitloop',
      name: 'Fitloop',
      statRange: '1.4x → 6.2x',
      clientMeta: 'HEALTH & FITNESS APP · 2025',
      headline: 'Scaling app downloads past 420k with Flutter & paid ads',
      description: 'High-conversion onboarding flow, viral referral mechanics, and real-time workout telemetry dashboard.',
      metricLabel: 'LIFETIME VALUE / CAC RATIO',
      beforeNum: 1.4,
      afterNum: 6.2,
      beforeDisplay: '1.4x',
      afterDisplay: '6.2x',
      tags: ['Mobile App', 'Growth'],
      image: 'assets/case-fitness-app.jpg',
      curvePath: 'M0,125 C140,125 210,105 310,65 C410,25 480,18 600,12',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'haven',
      name: 'Haven Realty',
      statRange: '14 → 122',
      clientMeta: 'LUXURY REAL ESTATE DEVELOPER · 2024',
      headline: 'Architectural web platform driving $48M in luxury sales',
      description: 'Ultra-fast 3D virtual tour architecture with hyper-targeted search ads for luxury estates and commercial towers.',
      metricLabel: 'QUALIFIED BUYER INQUIRIES / MO',
      beforeNum: 14,
      afterNum: 122,
      beforeDisplay: '14',
      afterDisplay: '122',
      tags: ['Web Design', 'PPC'],
      image: 'assets/about-digital-solutions.jpg',
      curvePath: 'M0,132 C110,132 230,110 330,75 C420,40 500,20 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'lumen',
      name: 'Lumen Skin',
      statRange: '$18k → $142k',
      clientMeta: 'DERMATOLOGY & SKINCARE · 2025',
      headline: 'From regional brand to international DTC powerhouse',
      description: 'Complete brand repositioning, custom Shopify Plus architecture, and programmatic search campaigns across 4 countries.',
      metricLabel: 'MONTHLY RECURRING REVENUE',
      beforeNum: 18,
      afterNum: 142,
      beforeDisplay: '$18k',
      afterDisplay: '$142k',
      tags: ['Branding', 'Shopify'],
      image: 'assets/case-dental-clinic.jpg',
      curvePath: 'M0,128 C130,128 240,100 340,60 C430,22 510,14 600,6',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'orbit',
      name: 'Orbit Legal',
      statRange: '9 → 57',
      clientMeta: 'COMMERCIAL LAW FIRM · 2024',
      headline: 'Dominating commercial litigation search queries in Gujarat & UK',
      description: 'Authoritative legal content hub, technical schema markup, and thought leadership PR attracting corporate retainers.',
      metricLabel: 'HIGH-VALUE CORPORATE RETAINERS',
      beforeNum: 9,
      afterNum: 57,
      beforeDisplay: '9',
      afterDisplay: '57',
      tags: ['SEO', 'Enterprise'],
      image: 'assets/about-office.jpg',
      curvePath: 'M0,130 C150,130 220,115 320,80 C410,45 500,24 600,10',
      ctaUrl: 'portfolio.html'
    }
  ];

  function initCaseStudySlider() {
    var section = document.getElementById('case-studies-section');
    if (!section) return;

    var tabs = Array.prototype.slice.call(section.querySelectorAll('.case-tab'));
    var sliderCard = section.querySelector('.case-slider-card');
    var splitHandle = section.querySelector('.case-split-handle');
    var beforeLayer = section.querySelector('.case-layer-before');
    var beforeImg = section.querySelector('.case-img-before');
    var afterImg = section.querySelector('.case-img-after');

    var clientBadge = section.querySelector('.case-client-badge-text');
    var metricLabel = section.querySelector('.case-metric-label');
    var beforeMetricEl = section.querySelector('.case-before-num');
    var afterMetricEl = section.querySelector('.case-after-num');
    var headlineEl = section.querySelector('.case-headline');
    var descEl = section.querySelector('.case-desc');
    var metaKickerEl = section.querySelector('.case-meta-kicker');
    var tagsContainer = section.querySelector('.case-tags-container');
    var ctaLink = section.querySelector('.case-cta-link');
    var chartPath = section.querySelector('.case-chart-path');

    if (!sliderCard || !splitHandle || !beforeLayer) return;

    var currentSplit = 50; // percentage
    var isDragging = false;
    var currentClientIdx = 0;

    // Set split position with hardware accelerated clip-path
    function setSplitPosition(pos) {
      currentSplit = Math.max(5, Math.min(95, pos));
      beforeLayer.style.clipPath = 'inset(0 ' + (100 - currentSplit) + '% 0 0)';
      splitHandle.style.left = currentSplit + '%';
    }

    // Drag Interaction Logic
    function onPointerDown(e) {
      isDragging = true;
      sliderCard.classList.add('is-sliding');
      updatePositionFromEvent(e);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      updatePositionFromEvent(e);
    }

    function onPointerUp() {
      isDragging = false;
      sliderCard.classList.remove('is-sliding');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    }

    function updatePositionFromEvent(e) {
      var rect = sliderCard.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var posPercent = (x / rect.width) * 100;
      setSplitPosition(posPercent);
    }

    sliderCard.addEventListener('pointerdown', onPointerDown);

    // Keyboard support on slider card
    sliderCard.setAttribute('tabindex', '0');
    sliderCard.setAttribute('role', 'slider');
    sliderCard.setAttribute('aria-label', 'Before and After comparison slider');
    sliderCard.setAttribute('aria-valuenow', '50');
    sliderCard.setAttribute('aria-valuemin', '5');
    sliderCard.setAttribute('aria-valuemax', '95');

    sliderCard.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSplitPosition(currentSplit - 5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSplitPosition(currentSplit + 5);
      }
    });

    // Animated Counter for metrics
    function animateCounter(el, targetStr, duration) {
      if (!el) return;
      var hasX = targetStr.indexOf('x') !== -1;
      var hasDollar = targetStr.indexOf('$') !== -1;
      var hasK = targetStr.indexOf('k') !== -1;

      // Extract raw number
      var clean = targetStr.replace(/[^0-9.]/g, '');
      var targetNum = parseFloat(clean) || 0;
      var start = 0;
      var startTime = null;

      function step(now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        // Ease out quad
        var ease = 1 - (1 - progress) * (1 - progress);
        var current = start + (targetNum - start) * ease;

        var formatted;
        if (hasX) {
          formatted = current.toFixed(1) + 'x';
        } else if (hasDollar) {
          formatted = '$' + Math.round(current) + (hasK ? 'k' : '');
        } else if (targetNum >= 1000) {
          formatted = Math.round(current).toLocaleString();
        } else {
          formatted = Math.round(current).toString();
        }

        el.textContent = formatted;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = targetStr;
        }
      }

      requestAnimationFrame(step);
    }

    // Switch Client Tab
    function selectClient(index) {
      var client = clientsData[index];
      if (!client) return;
      currentClientIdx = index;

      // Update tabs state
      tabs.forEach(function (tab, i) {
        if (i === index) {
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('is-active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      // Smooth card transition
      sliderCard.classList.add('is-transitioning');
      setTimeout(function () {
        // Update images
        if (beforeImg) beforeImg.src = client.image;
        if (afterImg) afterImg.src = client.image;

        // Update badges & metadata
        if (clientBadge) clientBadge.textContent = client.name + ' · 2025';
        if (metricLabel) metricLabel.textContent = client.metricLabel;
        if (metaKickerEl) metaKickerEl.textContent = client.clientMeta;
        if (headlineEl) headlineEl.textContent = client.headline;
        if (descEl) descEl.textContent = client.description;
        if (ctaLink) ctaLink.href = client.ctaUrl;

        // Animate counter values
        animateCounter(beforeMetricEl, client.beforeDisplay, 800);
        animateCounter(afterMetricEl, client.afterDisplay, 950);

        // Update curve path & animate dashoffset
        if (chartPath) {
          chartPath.setAttribute('d', client.curvePath);
          chartPath.style.animation = 'none';
          void chartPath.offsetHeight; // trigger reflow
          chartPath.style.animation = 'drawCurve 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }

        // Update tags
        if (tagsContainer) {
          tagsContainer.innerHTML = '';
          client.tags.forEach(function (tag) {
            var tagEl = document.createElement('span');
            tagEl.className = 'case-tag-pill';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
          });
        }

        sliderCard.classList.remove('is-transitioning');
      }, 150);
    }

    // Attach click events to tabs
    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        selectClient(idx);
      });
    });

    // Idle Auto-sway interactive hint (runs once when section enters viewport)
    var hasSwayed = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasSwayed) {
          hasSwayed = true;
          // Trigger growth curve animation
          if (chartPath) {
            chartPath.style.animation = 'drawCurve 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
          }
          // Subtle handle sway
          var startTime = performance.now();
          function sway(now) {
            var elapsed = now - startTime;
            if (elapsed < 1400 && !isDragging) {
              var offset = Math.sin((elapsed / 1400) * Math.PI * 2) * 8;
              setSplitPosition(50 + offset);
              requestAnimationFrame(sway);
            } else if (!isDragging) {
              setSplitPosition(50);
            }
          }
          requestAnimationFrame(sway);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(sliderCard);

    // Initial setup
    setSplitPosition(50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCaseStudySlider);
  } else {
    initCaseStudySlider();
  }
})();
