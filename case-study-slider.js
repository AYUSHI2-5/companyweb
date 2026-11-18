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
      name: 'KP E-Services',
      category: 'Loan Operations & FinTech Platform',
      statRange: 'React · Node.js · Wallets',
      clientMeta: 'CASE 01 · FINTECH & OPERATIONS',
      headline: 'End-to-End Loan Lifecycle & Connector Operations Platform',
      description: 'Engineered a unified loan operations portal guiding applications from lead and pre-login to sanction and disbursement, featuring bank criteria verification, automated payouts, referral wallets, and KYC document vaults.',
      metricLabel: 'DISBURSEMENT EFFICIENCY & SPEED',
      beforeNum: 100,
      afterNum: 340,
      beforeDisplay: 'Manual Intake',
      afterDisplay: 'Automated 24/7',
      tags: ['React.js', 'Node.js', 'Digital Wallets', 'Cloud Vault', 'FinTech APIs'],
      image: 'assets/portfolio-hero-1.png',
      curvePath: 'M0,130 C120,130 180,115 280,85 C380,55 440,25 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case2',
      name: 'Ashray Labs',
      category: 'Healthcare & Diagnostics Portal',
      statRange: 'Next.js · Clinical ERP · SMS',
      clientMeta: 'CASE 02 · HEALTHCARE & DIAGNOSTICS',
      headline: 'Pathology Center Portal, Appointment Booking & Report Engine',
      description: 'Developed an integrated web portal and clinical admin system where patients book appointments, browse test packages, request quotations, and instantly download invoices and reports with multi-city campaign tools.',
      metricLabel: 'PATIENT ACCESS & BOOKING VOLUME',
      beforeNum: 50,
      afterNum: 220,
      beforeDisplay: 'Walk-In Only',
      afterDisplay: 'Self-Service Web',
      tags: ['Next.js', 'Clinical ERP', 'PDF Report Engine', 'SMS Alerts', 'Cloud DB'],
      image: 'assets/case-dental-clinic.jpg',
      curvePath: 'M0,135 C100,135 220,120 320,70 C400,30 490,15 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case3',
      name: 'Chick N Go',
      category: 'Mobile Food Ordering Platform',
      statRange: 'Flutter · PWA · Multi-Domain',
      clientMeta: 'CASE 03 · FOOD & BEVERAGE E-COMMERCE',
      headline: 'Multi-Tenant Food Ordering Engine & Real-Time Kitchen Dispatch',
      description: 'Built a high-conversion online food ordering application and admin panel with live order tracking, payment processing, and a white-label frontend architecture running seamlessly across multiple domains.',
      metricLabel: 'DIRECT ORDERS & TURNOVER',
      beforeNum: 1,
      afterNum: 5,
      beforeDisplay: 'Third-Party Aggregator',
      afterDisplay: '0% Commission PWA',
      tags: ['Flutter / PWA', 'React.js', 'Online Payments', 'Multi-Tenant', 'Live Dispatch'],
      image: 'assets/portfolio-hero-2.png',
      curvePath: 'M0,125 C140,125 210,105 310,65 C410,25 480,18 600,12',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case4',
      name: 'ProCurve',
      category: 'Business Valuation Software',
      statRange: 'Python · Valuation Algorithms · Cloud',
      clientMeta: 'CASE 04 · VALUATION & FINANCIAL MODELING',
      headline: 'Valuation Workspace for Registered Valuers & Asset Appraisers',
      description: 'Created an internal financial modeling software enabling registered valuers to manage clients, share capital, and director files, and execute income, market, and net-asset valuation algorithms on audit-ready sheets.',
      metricLabel: 'VALUATION REPORTING ACCURACY',
      beforeNum: 80,
      afterNum: 99,
      beforeDisplay: 'Spreadsheet Drafts',
      afterDisplay: 'Audit-Ready Suite',
      tags: ['Python', 'React.js', 'Financial Modeling', 'Data Security', 'Audit Workflows'],
      image: 'assets/about-office-mockup.jpg',
      curvePath: 'M0,130 C130,130 200,110 300,75 C400,40 470,20 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case5',
      name: 'Just Land',
      category: 'Property Marketplace & FSBO Portal',
      statRange: 'Next.js · Mapbox · Real-Time Chat',
      clientMeta: 'CASE 05 · REAL ESTATE & PROPTECH',
      headline: 'Interactive Property Marketplace & In-App Buyer-Agent Chat',
      description: 'Engineered a land and property marketplace where buyers search listings, featured homes, and FSBO properties, save favorites, and message agents and sellers directly through encrypted chat.',
      metricLabel: 'BUYER ENGAGEMENT & INQUIRIES',
      beforeNum: 25,
      afterNum: 92,
      beforeDisplay: 'Static Classifieds',
      afterDisplay: 'Real-Time Interactive',
      tags: ['Next.js', 'Mapbox GL', 'WebSocket Chat', 'Node.js', 'FSBO Engine'],
      image: 'assets/hero-building.jpg',
      curvePath: 'M0,135 C110,135 220,115 320,60 C420,15 480,10 600,5',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case6',
      name: 'Dodani ERP',
      category: 'Brokerage Back-Office & Escrow ERP',
      statRange: 'Django · Postgres · Escrow Vault',
      clientMeta: 'CASE 06 · ENTERPRISE OPERATIONS',
      headline: 'Internal Real Estate Workspace, Escrow & Water Rights Engine',
      description: 'Architected an internal operations system for real estate brokerage teams to coordinate leads, tasks, properties, offers, escrow stages, shared well water agreements, and transaction vaults.',
      metricLabel: 'TRANSACTION CLOSING EFFICIENCY',
      beforeNum: 35,
      afterNum: 88,
      beforeDisplay: 'Fragmented Files',
      afterDisplay: 'Unified Back-Office',
      tags: ['React.js', 'Python / Django', 'PostgreSQL', 'Escrow Vault', 'AWS S3'],
      image: 'assets/about-office-showcase.png',
      curvePath: 'M0,130 C120,130 200,105 310,65 C410,25 490,15 600,10',
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
