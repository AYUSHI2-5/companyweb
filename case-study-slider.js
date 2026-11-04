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
      id: 'case1',
      name: 'Business Management Platform',
      category: 'Web Application Development',
      statRange: 'React · Python · MySQL',
      clientMeta: 'CASE 01 · ENTERPRISE TECHNOLOGY',
      headline: 'Centralized Business Operations & Automated Workflows',
      description: 'Developed a centralized web application with an intuitive dashboard, automated workflows and integrated database management to streamline operations.',
      metricLabel: 'SYSTEM EFFICIENCY & DATA',
      beforeNum: 100,
      afterNum: 340,
      beforeDisplay: 'Manual',
      afterDisplay: 'Automated',
      tags: ['React.js', 'Python', 'Django', 'MySQL'],
      image: 'assets/about-office.jpg',
      curvePath: 'M0,130 C120,130 180,115 280,85 C380,55 440,25 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case2',
      name: 'Corporate Digital Presence',
      category: 'Corporate Website Development',
      statRange: 'HTML5 · CSS3 · Bootstrap',
      clientMeta: 'CASE 02 · PROFESSIONAL SERVICES',
      headline: 'Seamless Omnichannel Navigation & Modern Corporate Presence',
      description: 'Designed and developed a responsive, modern website with structured content and an intuitive user interface ensuring high accessibility.',
      metricLabel: 'CROSS-DEVICE ACCESSIBILITY',
      beforeNum: 50,
      afterNum: 100,
      beforeDisplay: 'Legacy Web',
      afterDisplay: 'Responsive',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      image: 'assets/hero-office.jpg',
      curvePath: 'M0,135 C100,135 220,120 320,70 C400,30 490,15 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case3',
      name: 'Smart Mobile Application',
      category: 'Mobile Application Development',
      statRange: 'Flutter · Firebase · REST',
      clientMeta: 'CASE 03 · MOBILE TECHNOLOGY',
      headline: 'Mobile-First Accessibility & Integrated Backend Services',
      description: 'Developed a mobile-first application with user-friendly navigation and integrated backend services for seamless convenience.',
      metricLabel: 'MOBILE ADOPTION & USAGE',
      beforeNum: 1,
      afterNum: 5,
      beforeDisplay: 'Web-Only',
      afterDisplay: 'iOS & Android',
      tags: ['Flutter', 'Firebase', 'REST APIs', 'UI/UX Design'],
      image: 'assets/case-fitness-app.jpg',
      curvePath: 'M0,125 C140,125 210,105 310,65 C410,25 480,18 600,12',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case4',
      name: 'Cloud Infrastructure Modernization',
      category: 'Cloud & Infrastructure Solutions',
      statRange: 'AWS · Linux · Docker',
      clientMeta: 'CASE 04 · INFORMATION TECHNOLOGY',
      headline: 'Scalable Infrastructure & Optimized Resource Management',
      description: 'Designed a cloud-ready infrastructure approach with optimized deployment and resource management to support evolving requirements.',
      metricLabel: 'SYSTEM RELIABILITY & SCALE',
      beforeNum: 80,
      afterNum: 99,
      beforeDisplay: 'Monolith',
      afterDisplay: 'Cloud-Ready',
      tags: ['AWS', 'Linux', 'Docker', 'Optimization'],
      image: 'assets/cta-collaboration.jpg',
      curvePath: 'M0,132 C110,132 230,110 330,75 C420,40 500,20 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case5',
      name: 'Intelligent Business Automation',
      category: 'AI & Automation',
      statRange: 'Python · ML · REST APIs',
      clientMeta: 'CASE 05 · ARTIFICIAL INTELLIGENCE',
      headline: 'Intelligent Automation Workflows & AI Functionality',
      description: 'Integrated intelligent automation workflows and AI-powered functionality into existing business processes to eliminate repetitive manual tasks.',
      metricLabel: 'AUTOMATION & INSIGHTS',
      beforeNum: 20,
      afterNum: 90,
      beforeDisplay: 'Manual Entry',
      afterDisplay: 'AI Workflows',
      tags: ['Python', 'Machine Learning', 'REST APIs', 'Automation'],
      image: 'assets/about-digital-solutions.jpg',
      curvePath: 'M0,128 C130,128 240,100 340,60 C430,22 510,14 600,6',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case6',
      name: 'Enterprise Management System',
      category: 'Enterprise Software Solutions',
      statRange: 'Python · Django · Postgres',
      clientMeta: 'CASE 06 · ENTERPRISE SOFTWARE',
      headline: 'Centralized Software Solution & Structured Data Hub',
      description: 'Developed a centralized software solution with structured data management, automated reporting and multi-system integrations.',
      metricLabel: 'OPERATIONAL DATA UNITY',
      beforeNum: 10,
      afterNum: 100,
      beforeDisplay: 'Siloed Tools',
      afterDisplay: 'Central Hub',
      tags: ['Python', 'Django', 'PostgreSQL', 'JavaScript'],
      image: 'assets/hero-building.jpg',
      curvePath: 'M0,135 C90,135 200,115 300,75 C410,35 500,18 600,6',
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
