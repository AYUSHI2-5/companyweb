/**
 * Interactive Liquid Water Ripple & Wave Crest Engine
 * Renders real-time liquid wave rings, water disturbances, and caustic ripples over the crowd background.
 * Works seamlessly in both local file:// and web server environments without CORS errors.
 */

(function () {
  'use strict';

  var isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  function initWaterRipple() {
    var canvas = document.getElementById('waterRippleCanvas');
    var container = document.getElementById('hero-section');
    if (!canvas || !container) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = 0;
    var height = 0;

    // Array of active liquid ripples
    var ripples = [];

    function resize() {
      width = container.offsetWidth || window.innerWidth;
      height = container.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function addRipple(x, y, maxRadius, intensity) {
      ripples.push({
        x: x,
        y: y,
        radius: 4,
        maxRadius: maxRadius || 180,
        speed: 2.2 + Math.random() * 1.2,
        intensity: intensity || 1.0,
        decay: 0.009,
        life: 1.0,
        rings: 3
      });
      if (ripples.length > 25) {
        ripples.shift();
      }
    }

    // Pointer move listener
    var lastX = -1;
    var lastY = -1;
    var moveThrottle = 0;

    container.addEventListener('pointermove', function (e) {
      var rect = container.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var now = Date.now();
      if (now - moveThrottle > 50) {
        moveThrottle = now;
        var dist = Math.hypot(x - lastX, y - lastY);
        if (dist > 8) {
          addRipple(x, y, 140 + dist * 2, Math.min(1.0, dist / 30));
          lastX = x;
          lastY = y;
        }
      }
    });

    container.addEventListener('pointerdown', function (e) {
      var rect = container.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      addRipple(x, y, 280, 1.4);
      setTimeout(function () {
        addRipple(x, y, 220, 1.0);
      }, 90);
    });

    // Autonomous ambient drops falling naturally
    setInterval(function () {
      if (document.hidden) return;
      var rx = width * (0.2 + Math.random() * 0.6);
      var ry = height * (0.2 + Math.random() * 0.6);
      addRipple(rx, ry, 180 + Math.random() * 100, 0.85 + Math.random() * 0.4);
    }, 2400);

    // Initial ripple burst around the central lens
    setTimeout(function () {
      addRipple(width * 0.5, height * 0.45, 340, 1.2);
    }, 500);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Render ripples
      for (var i = ripples.length - 1; i >= 0; i--) {
        var r = ripples[i];
        r.radius += r.speed;
        r.life -= r.decay;

        if (r.life <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        var alpha = Math.max(0, r.life * 0.45 * r.intensity);

        // Draw multi-tier concentric water wavefront rings
        for (var ring = 0; ring < r.rings; ring++) {
          var ringRadius = r.radius - (ring * 16);
          if (ringRadius <= 3) continue;

          var ringAlpha = alpha * (1 - (ring * 0.28));

          // Outer shadow refraction line
          ctx.beginPath();
          ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 0, 0, ' + (ringAlpha * 0.6) + ')';
          ctx.lineWidth = 4.5;
          ctx.stroke();

          // Luminous specular caustic wave crest line
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0.1, ringRadius - 1.5), 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(235, 245, 255, ' + (ringAlpha * 0.95) + ')';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Subtle caustic light halo
          ctx.beginPath();
          ctx.arc(r.x, r.y, ringRadius + 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(212, 255, 58, ' + (ringAlpha * 0.35) + ')';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
  }

  document.addEventListener('DOMContentLoaded', initWaterRipple);
})();
