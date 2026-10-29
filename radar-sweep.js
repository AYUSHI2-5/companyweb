/**
 * Interactive Polar Radar Sweeper Engine
 * Recreates the rotating brand radar graphic from the visual reference
 * Features:
 * - Concentric polar range circles with angle indicators (0°, 90°, 180°, 270°)
 * - Rotating radar sweep beam with trailing luminous gradient
 * - Blip targets that illuminate and ping when the radar beam sweeps past
 * - Interactive hover states on brand targets
 */

(function () {
  'use strict';

  var isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initRadarSweep() {
    var canvas = document.getElementById('brandRadarCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var size = 520;
    var currentAngle = 0;
    var sweepSpeed = isReduced ? 0 : 0.022; // radians per frame

    // Client and technology blips positioned at (distance: 0-1, angle: radians, label, category, color)
    var targets = [
      { r: 0.72, angle: 0.65, label: 'Single Origin', cat: 'Retail Brand', color: '#E7192D', ping: 0 },
      { r: 0.45, angle: 1.15, label: 'E-commerce platform', cat: 'Shopify Plus', color: '#10B981', ping: 0 },
      { r: 0.82, angle: 2.85, label: 'FinTech Mobile App', cat: 'Flutter & Cloud', color: '#E7192D', ping: 0 },
      { r: 0.60, angle: 3.85, label: 'Enterprise ERP', cat: 'Custom SaaS', color: '#3B82F6', ping: 0 },
      { r: 0.88, angle: 4.60, label: 'Global Logistics Hub', cat: 'Laravel Platform', color: '#F59E0B', ping: 0 },
      { r: 0.35, angle: 5.40, label: 'Healthcare Network', cat: 'Web Architecture', color: '#8B5CF6', ping: 0 }
    ];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      size = Math.min(rect.width || 520, 560);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      var cx = size / 2;
      var cy = size / 2;
      var maxR = (size / 2) - 34;

      ctx.clearRect(0, 0, size, size);

      // 1. Concentric circles
      var rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach(function (ringRatio) {
        var r = maxR * ringRatio;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = ringRatio === 1.0 ? 'rgba(0, 0, 0, 0.22)' : 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = ringRatio === 1.0 ? 1.5 : 1;
        ctx.stroke();
      });

      // 2. Crosshair grid & Angle ticks
      ctx.beginPath();
      ctx.moveTo(cx - maxR - 12, cy);
      ctx.lineTo(cx + maxR + 12, cy);
      ctx.moveTo(cx, cy - maxR - 12);
      ctx.lineTo(cx, cy + maxR + 12);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Degree labels
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('0°', cx + maxR + 24, cy);
      ctx.fillText('90°', cx, cy + maxR + 18);
      ctx.fillText('180°', cx - maxR - 24, cy);
      ctx.fillText('270°', cx, cy - maxR - 18);

      // 3. Rotating Radar Sweep Beam (Luminous sector)
      if (!isReduced) {
        currentAngle = (currentAngle + sweepSpeed) % (Math.PI * 2);

        var sweepArc = 0.55; // width of trailing beam
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, currentAngle - sweepArc, currentAngle, false);
        ctx.closePath();

        // Lime-tinted luminous gradient matching Reachwise styling
        var grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(212, 255, 58, 0.45)');
        grad.addColorStop(0.7, 'rgba(212, 255, 58, 0.22)');
        grad.addColorStop(1, 'rgba(212, 255, 58, 0.02)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Leading crisp edge line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(currentAngle) * maxR, cy + Math.sin(currentAngle) * maxR);
        ctx.strokeStyle = 'rgba(212, 255, 58, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Center Hub
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#0D0E10';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#0D0E10';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Render Brand / Client Targets
      targets.forEach(function (t) {
        var tx = cx + Math.cos(t.angle) * (t.r * maxR);
        var ty = cy + Math.sin(t.angle) * (t.r * maxR);

        // Check if sweeping beam hits this blip
        var diff = (currentAngle - t.angle + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.08) {
          t.ping = 1.0;
        }

        // Decay ping
        if (t.ping > 0) {
          t.ping -= 0.02;
          if (t.ping < 0) t.ping = 0;
        }

        // Pinging circle
        if (t.ping > 0) {
          var pingRadius = 6 + (1 - t.ping) * 22;
          ctx.beginPath();
          ctx.arc(tx, ty, pingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(231, 25, 45, ' + t.ping + ')';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        // Core blip dot
        ctx.beginPath();
        ctx.arc(tx, ty, 5, 0, Math.PI * 2);
        ctx.fillStyle = t.ping > 0.4 ? '#E7192D' : '#0D0E10';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label Tag Pill
        var text = t.label;
        ctx.font = '600 11px "Inter", sans-serif';
        var metrics = ctx.measureText(text);
        var pillW = metrics.width + 16;
        var pillH = 22;
        var pillX = tx + 10;
        var pillY = ty - 11;

        // Ensure pill stays within canvas bounds
        if (pillX + pillW > size - 10) pillX = tx - pillW - 10;

        ctx.fillStyle = t.ping > 0.4 ? 'rgba(231, 25, 45, 0.95)' : 'rgba(13, 14, 16, 0.88)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 11);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, pillX + 8, pillY + (pillH / 2));
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
  }

  document.addEventListener('DOMContentLoaded', initRadarSweep);
})();
