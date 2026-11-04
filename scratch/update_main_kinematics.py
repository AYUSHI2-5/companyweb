with open('main.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re
pattern = r'  /\* ==========================================================================\s*9\. Automated Section-by-Section Presentation & Teacher Avatar Guide[\s\S]*?  /\* ==========================================================================\s*10\. Initialize All Components on DOM Ready'

replacement = '''  /* ==========================================================================
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
    var tourSections = [
      { id: 'hero-section', name: 'Overview', duration: 7500 },
      { id: 'radar-section', name: 'Brand Radar', duration: 8000 },
      { id: 'services-section', name: 'Our Services', duration: 8500 },
      { id: 'case-studies-section', name: 'Case Studies', duration: 8000 },
      { id: 'funnel-section', name: 'How We Work', duration: 8000 },
      { id: 'cta-section', name: 'Start Project', duration: 7000 },
      { id: 'site-footer', name: 'Footer', duration: 6500 }
    ].filter(function (item) {
      return document.getElementById(item.id) !== null;
    });

    if (tourSections.length < 2) return;

    var teacherWidget = document.getElementById('teacherGuideWidget');
    var teacherAvatarWrapper = document.getElementById('teacherAvatarWrapper');
    var teacherArmLayer = document.getElementById('teacherArmLayer');
    var teacherWristLayer = document.getElementById('teacherWristLayer');
    var teacherPostureLayer = document.getElementById('teacherPostureLayer');
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
    var currentPostureAngle = 0.0;
    var targetPostureAngle = 0.0;

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
      var explainingOrbitX = 0;
      var explainingOrbitY = 0;
      var explainingWristRot = 0;
      var headNod = 0;

      if (isIdleExplaining) {
        // Teacher Explaining Gesture: Gentle organic orbital motion with stylus
        var phase = (now - lastScrollMoveTime - 550) * 0.0022;
        explainingOrbitX = Math.cos(phase) * 2.8;
        explainingOrbitY = Math.sin(phase * 2.0) * 1.6; // Subtle figure-8 loop
        explainingWristRot = Math.sin(phase) * 3.2;

        // Subtle head tilting and eye gaze shift toward the board
        headNod = Math.sin(phase * 0.8) * 0.9;
      }

      // Natural breathing sway (±0.4deg)
      var naturalBreath = Math.sin(now * 0.0016) * 0.45;

      // Final target angles
      targetArmAngle = basePointingAngle + velocityImpulse + highlightImpulse + cueImpulse + (explainingWristRot * 0.4);
      // Anatomical clamp: -24deg (high reach) to +20deg (low point)
      targetArmAngle = Math.max(-24.0, Math.min(20.0, targetArmAngle));

      // Posture / Head tilt: directed toward board content (-1.2deg up to +1.8deg)
      var targetPosture = (targetArmAngle * 0.07) + headNod + naturalBreath;
      targetPostureAngle = Math.max(-1.8, Math.min(2.4, targetPosture));

      // Wrist angle: flexes to keep stylus oriented cleanly toward presentation
      targetWristAngle = (targetArmAngle * -0.15) + (highlightImpulse * 0.8) + explainingWristRot;

      // 3. Smooth Damped Spring / Lerp Integration
      if (!isInitialized) {
        currentArmAngle = targetArmAngle;
        currentPostureAngle = targetPostureAngle;
        currentWristAngle = targetWristAngle;
        wristOrbitX = explainingOrbitX;
        wristOrbitY = explainingOrbitY;
        isInitialized = true;
      } else {
        // Responsive Lerp damping
        currentArmAngle += (targetArmAngle - currentArmAngle) * 0.18;
        currentPostureAngle += (targetPostureAngle - currentPostureAngle) * 0.12;
        currentWristAngle += (targetWristAngle - currentWristAngle) * 0.22;
        wristOrbitX += (explainingOrbitX - wristOrbitX) * 0.15;
        wristOrbitY += (explainingOrbitY - wristOrbitY) * 0.15;
      }

      // 4. Apply Transforms to Respective Architectural Layers
      if (teacherArmLayer) {
        teacherArmLayer.style.transform = 'rotate(' + currentArmAngle.toFixed(2) + 'deg)';
      }

      if (teacherWristLayer) {
        teacherWristLayer.style.transform = 'translate(' + wristOrbitX.toFixed(2) + 'px, ' + wristOrbitY.toFixed(2) + 'px) rotate(' + currentWristAngle.toFixed(2) + 'deg)';
      }

      if (teacherPostureLayer) {
        teacherPostureLayer.style.transform = 'rotate(' + currentPostureAngle.toFixed(2) + 'deg)';
      }

      requestAnimationFrame(updateTeacherPresenterLoop);
    }

    if (teacherArmLayer || teacherPostureLayer) {
      requestAnimationFrame(updateTeacherPresenterLoop);
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
        clearScheduledTimers();
        isUserScrolling = false;
        performTeacherScrollCue(nextIdx);
      });
    }

    setTimeout(function () {
      if (!isUserScrolling) {
        currentIndex = getDominantVisibleSection();
        triggerSectionAnimation(currentIndex);
        scheduleNext(currentIndex);
      }
    }, 1800);
  }

  /* ==========================================================================
     10. Initialize All Components on DOM Ready'''

new_c, count = re.subn(pattern, replacement, c)
print(f'Replacements in main.js: {count}')

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(new_c)

