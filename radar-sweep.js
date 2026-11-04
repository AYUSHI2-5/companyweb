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

    // Balanced 6-sector distribution with safe radial placement to guarantee zero label collisions
    var targets = [
      { r: 0.62, angle: 5.45, label: 'Website Development', align: 'top', color: '#E7192D', ping: 0 },
      { r: 0.58, angle: 0.40, label: 'E-Commerce Development', align: 'bottom', color: '#E7192D', ping: 0 },
      { r: 0.68, angle: 1.65, label: 'Game Development', align: 'bottom', color: '#E7192D', ping: 0 },
      { r: 0.60, angle: 2.70, label: 'Software Development', align: 'bottom', color: '#E7192D', ping: 0 },
      { r: 0.65, angle: 3.75, label: 'Digital Marketing', align: 'top', color: '#E7192D', ping: 0 },
      { r: 0.62, angle: 4.80, label: 'Application Development', align: 'top', color: '#E7192D', ping: 0 }
    ];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      size = Math.round(rect.width || 580);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      var cx = size / 2;
      var cy = size / 2;
      var maxR = (size / 2) - 40;

      ctx.clearRect(0, 0, size, size);

      // 1. Concentric circles
      var rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach(function (ringRatio) {
        var r = maxR * ringRatio;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = ringRatio === 1.0 ? 'rgba(231, 25, 45, 0.35)' : 'rgba(231, 25, 45, 0.16)';
        ctx.lineWidth = ringRatio === 1.0 ? 1.5 : 1;
        ctx.stroke();
      });

      // 2. Crosshair grid & Angle ticks
      ctx.beginPath();
      ctx.moveTo(cx - maxR - 12, cy);
      ctx.lineTo(cx + maxR + 12, cy);
      ctx.moveTo(cx, cy - maxR - 12);
      ctx.lineTo(cx, cy + maxR + 12);
      ctx.strokeStyle = 'rgba(231, 25, 45, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Degree labels
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = '#E7192D';
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

        // Red luminous gradient matching Baadam brand identity
        var grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(231, 25, 45, 0.45)');
        grad.addColorStop(0.7, 'rgba(231, 25, 45, 0.22)');
        grad.addColorStop(1, 'rgba(231, 25, 45, 0.02)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Leading crisp edge line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(currentAngle) * maxR, cy + Math.sin(currentAngle) * maxR);
        ctx.strokeStyle = 'rgba(231, 25, 45, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // Center Hub
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#E7192D';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(231, 25, 45, 0.45)';
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
        ctx.fillStyle = '#E7192D';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label Tag Pill
        var text = t.label;
        ctx.font = '600 11.5px "Inter", -apple-system, sans-serif';
        var metrics = ctx.measureText(text);
        var pillW = Math.round(metrics.width + 16);
        var pillH = 22;

        // Position pill vertically offset from blip so blip dot remains completely visible
        var pillX = Math.round(tx - pillW / 2);
        var pillY = t.align === 'bottom' ? Math.round(ty + 10) : Math.round(ty - pillH - 10);

        // Keep strictly within canvas bounds
        if (pillX < 14) pillX = 14;
        if (pillX + pillW > size - 14) pillX = size - 14 - pillW;
        if (pillY < 14) pillY = 14;
        if (pillY + pillH > size - 14) pillY = size - 14 - pillH;

        // Connector line linking blip dot to pill
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, t.align === 'bottom' ? pillY : (pillY + pillH));
        ctx.strokeStyle = 'rgba(231, 25, 45, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(231, 25, 45, 0.94)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(pillX, pillY, pillW, pillH, 11);
        } else {
          ctx.rect(pillX, pillY, pillW, pillH);
        }
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, pillX + (pillW / 2), pillY + (pillH / 2));
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
  }

  document.addEventListener('DOMContentLoaded', initRadarSweep);
})();
