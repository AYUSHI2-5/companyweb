/**
 * BAADAM — Next-Level Live Animated Networking Background Engine
 * 
 * Architecture & Features:
 * 1. Intelligent Network Clustering:
 *    - Nodes form naturally interconnected clusters around organic focal hubs.
 *    - Cross-cluster gateway bridge nodes create a cohesive, living constellation topology.
 *    - Distance-based dynamic connectivity with smooth quadratic alpha falloff (no popping).
 *    - Dual-tier connection hierarchy: crisp BAADAM Red (#E7192D) primary links and
 *      ultra-delicate pale-red / tech-slate (#94A3B8) secondary links.
 * 
 * 2. Real-Time Animated Data Flow & Line Illumination:
 *    - Dynamic data pulses travel along active network connections with varied speeds.
 *    - Motion-streaked luminous gradient tails simulate high-speed digital packet transmission.
 *    - Active Line Illumination: As a pulse passes through a link, that segment illuminates
 *      with a traveling brightness highlight.
 *    - Packet Route Relaying: Upon reaching a destination node, pulses can hop to an adjacent
 *      connected neighbor to simulate authentic neural/data packet routing.
 * 
 * 3. Multi-Layer Depth & Premium Node Styling:
 *    - Primary Core Nodes: Multi-layered optics with soft ambient radial gradient, mid-glow halo,
 *      rich red core, and crisp micro-white optical center.
 *    - Secondary Blue-Grey Depth Nodes (#64748B / #94A3B8): Sits in a recessed depth plane.
 *    - Soft Concentric Ripple Rings: Cluster hubs periodically release subtle, slowly expanding
 *      optical rings that gracefully dissipate.
 *    - Deep Micro-Particles: Freely drifting background particles creating genuine 3D parallax depth.
 * 
 * 4. Multi-Layer Motion & Smooth Desktop Parallax:
 *    - 3 distinct depth planes (Deep 0.35x, Mid 0.65x, Foreground 1.0x).
 *    - Desktop: Ultra-subtle, dampened pointer parallax that gives natural physical depth on mouse move.
 *    - Mobile: Purely autonomous organic sinusoidal drift, zero battery drain from pointer events.
 * 
 * 5. Footer Extension & Subtle Balancing:
 *    - Dedicated 'footer' variant tuned for calm, non-distracting elegance behind navigation & CTA.
 *    - Slower drift speed (0.65x), fewer nodes and particles, thinner links, and restrained pulse cadence.
 *    - Safe clearance padding at bottom (56px) so nodes stay comfortably above the red copyright bar.
 *    - Smooth feathering transition mask from preceding sections into the footer.
 * 
 * 6. Strict Responsive Boundary Containment:
 *    - Hard canvas clipping (ctx.clip()) within parent wrapper (position: absolute; inset: 0).
 *    - Clamped coordinate bounds with generous bottom clearance (38px) on hero to protect the logo marquee.
 *    - Zero horizontal overflow: Fluid 100% canvas CSS sizing, DPR scaling, and orientationchange listeners.
 *    - Full prefers-reduced-motion and document visibility lifecycle optimization.
 */

(function () {
  'use strict';

  var BRAND_RED = '231, 25, 45';         // #E7192D BAADAM signature red
  var BRAND_PALE_RED = '244, 96, 110';   // Pale soft red for illuminated highlights
  var SLATE_BLUE = '100, 116, 139';      // #64748B Slate depth
  var LIGHT_SLATE = '148, 163, 184';     // #94A3B8 Crisp secondary slate
  var PALE_NEUTRAL = '215, 225, 235';    // Subtle connector neutral

  var prefersReduced = false;
  if (window.matchMedia) {
    prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function SectionTechCanvas(container, options) {
    this.container = container;
    this.options = options || {};
    this.variant = options.variant || 'default';

    // Enforce container containment & zero pointer interception
    if (this.container) {
      this.container.style.position = 'absolute';
      this.container.style.inset = '0';
      this.container.style.overflow = 'hidden';
      this.container.style.pointerEvents = 'none';
    }

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'baadam-tech-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.display = 'block';
    this.canvas.style.overflow = 'hidden';

    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.nodes = [];
    this.particles = [];
    this.pulses = [];
    this.ripples = [];
    this.clusterHubs = [];

    // Pointer & Parallax tracking
    this.mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, isInside: false };
    this.parallax = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };

    this.isRunning = false;
    this.rafId = null;
    this.lastTime = 0;
    this.rippleTimer = 0;

    this.init();
  }

  SectionTechCanvas.prototype.init = function () {
    this.resize();

    var self = this;
    var parentSection = self.container.closest('section, main, header, footer') || self.container.parentElement;

    // Desktop: Smooth subtle parallax pointer tracking
    if (window.innerWidth > 992 && !prefersReduced && parentSection) {
      parentSection.addEventListener('mousemove', function (e) {
        var rect = self.canvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        if (mx >= 0 && mx <= self.width && my >= 0 && my <= self.height) {
          self.mouse.targetX = mx;
          self.mouse.targetY = my;
          self.mouse.isInside = true;

          // Parallax normalized between -1 and +1 from center (slightly reduced on footer)
          var maxShift = (self.variant === 'footer') ? 8 : 12;
          var normX = (mx - self.width * 0.5) / (self.width * 0.5);
          var normY = (my - self.height * 0.5) / (self.height * 0.5);
          self.parallax.targetX = normX * maxShift;
          self.parallax.targetY = normY * (maxShift * 0.75);
        } else {
          self.mouse.isInside = false;
          self.parallax.targetX = 0;
          self.parallax.targetY = 0;
        }
      }, { passive: true });

      parentSection.addEventListener('mouseleave', function () {
        self.mouse.isInside = false;
        self.mouse.targetX = -9999;
        self.mouse.targetY = -9999;
        self.parallax.targetX = 0;
        self.parallax.targetY = 0;
      }, { passive: true });
    }

    // Dynamic resize and device orientation handlers
    var handleResize = function () {
      self.resize();
    };

    if (window.ResizeObserver) {
      this.ro = new ResizeObserver(handleResize);
      this.ro.observe(this.container);
    }
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Page visibility listener: pause when browser tab is inactive to conserve battery
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        self.stop();
      } else if (self.isIntersecting) {
        self.start();
      }
    });

    // Viewport intersection observer: run only when section is visible
    this.isIntersecting = false;
    if (window.IntersectionObserver) {
      this.io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            self.isIntersecting = true;
            self.start();
          } else {
            self.isIntersecting = false;
            self.stop();
          }
        });
      }, { threshold: [0, 0.05] });
      this.io.observe(this.container);
    } else {
      this.isIntersecting = true;
      this.start();
    }
  };

  SectionTechCanvas.prototype.resize = function () {
    var rect = this.container.getBoundingClientRect();
    var width = Math.floor(this.container.clientWidth || rect.width);
    var height = Math.floor(this.container.clientHeight || rect.height);

    if (width <= 0) width = Math.floor(rect.width || window.innerWidth || 320);
    if (height <= 0) height = Math.floor(rect.height || 400);

    this.width = width;
    this.height = height;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);

    // Keep CSS dimensions strictly 100% of container to prevent horizontal overflow
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.buildOrAdjustTopology();
    if (prefersReduced) {
      this.renderStatic();
    }
  };

  SectionTechCanvas.prototype.buildOrAdjustTopology = function () {
    var width = this.width;
    var height = this.height;
    var isMobile = width < 640;
    var isTablet = width >= 640 && width < 992;
    var isFooter = (this.variant === 'footer');

    var targetNodeCount;
    var targetParticleCount;
    var maxDistance;

    if (this.variant === 'hero') {
      targetNodeCount = isMobile ? 12 : (isTablet ? 18 : 26);
      targetParticleCount = isMobile ? 12 : 22;
      maxDistance = isMobile ? 85 : (isTablet ? 110 : 135);
    } else if (isFooter) {
      // Footer: Restrained and calm, avoiding clutter behind columns of text & links
      targetNodeCount = isMobile ? 8 : (isTablet ? 12 : 17);
      targetParticleCount = isMobile ? 8 : 14;
      maxDistance = isMobile ? 75 : (isTablet ? 95 : 115);
    } else if (this.variant === 'team') {
      targetNodeCount = isMobile ? 9 : (isTablet ? 14 : 20);
      targetParticleCount = isMobile ? 10 : 18;
      maxDistance = isMobile ? 80 : 115;
    } else if (this.variant === 'page') {
      targetNodeCount = isMobile ? 10 : (isTablet ? 16 : 24);
      targetParticleCount = isMobile ? 10 : 18;
      maxDistance = isMobile ? 80 : 120;
    } else {
      targetNodeCount = isMobile ? 9 : (isTablet ? 14 : 20);
      targetParticleCount = isMobile ? 10 : 18;
      maxDistance = isMobile ? 80 : 115;
    }

    this.maxDistance = maxDistance;

    // Boundary margins: protect container edges and provide extra clearance for marquee (hero) / copyright bar (footer)
    var padX = 24;
    var padTop = isFooter ? 24 : 20;
    var padBottom = (this.variant === 'hero') ? 38 : (isFooter ? 56 : 24);

    var minX = padX;
    var maxX = Math.max(minX + 10, width - padX);
    var minY = padTop;
    var maxY = Math.max(minY + 10, height - padBottom);

    this.bounds = { minX: minX, maxX: maxX, minY: minY, maxY: maxY };

    // Define organic cluster centers (hubs) distributed harmoniously across the section
    if (isFooter) {
      this.clusterHubs = [
        { x: minX + (maxX - minX) * (isMobile ? 0.30 : 0.18), y: minY + (maxY - minY) * 0.40, radius: 120 },
        { x: minX + (maxX - minX) * (isMobile ? 0.70 : 0.52), y: minY + (maxY - minY) * 0.48, radius: 130 },
        { x: minX + (maxX - minX) * (isMobile ? 0.50 : 0.84), y: minY + (maxY - minY) * 0.38, radius: 125 }
      ];
    } else {
      this.clusterHubs = [
        { x: minX + (maxX - minX) * (isMobile ? 0.35 : 0.22), y: minY + (maxY - minY) * 0.38, radius: 140 },
        { x: minX + (maxX - minX) * (isMobile ? 0.75 : 0.78), y: minY + (maxY - minY) * (isMobile ? 0.30 : 0.26), radius: 150 },
        { x: minX + (maxX - minX) * (isMobile ? 0.50 : 0.82), y: minY + (maxY - minY) * 0.72, radius: 130 }
      ];
    }

    // Speed multiplier: Footer moves slower (0.65x) for an elegant, calm ambient backdrop
    var speedMultiplier = isFooter ? 0.65 : 1.0;

    // If nodes already exist, clamp them into updated container bounds
    if (this.nodes.length > 0) {
      for (var i = 0; i < this.nodes.length; i++) {
        var n = this.nodes[i];
        n.x = Math.max(minX, Math.min(maxX, n.x));
        n.y = Math.max(minY, Math.min(maxY, n.y));
      }
      if (this.nodes.length > targetNodeCount) {
        this.nodes.length = targetNodeCount;
      }
    }

    // Spawn nodes affiliated with clusters + bridge nodes
    while (this.nodes.length < targetNodeCount) {
      var idx = this.nodes.length;
      var isBridge = (idx % 5 === 0);            // Cross-cluster gateway bridge nodes
      var isBrand = (idx % 3 === 0) || isBridge;  // 1 in 3 is signature brand red
      var isDepthNode = !isBrand && (idx % 2 === 1); // Secondary tech blue-grey depth node
      var hasGlow = (idx % 6 === 0) || (idx === 1); // Selected cluster anchor nodes emit glowing halos

      // Affiliated cluster hub
      var hub = this.clusterHubs[idx % this.clusterHubs.length];
      var angle = Math.random() * Math.PI * 2;
      var distFromHub = Math.random() * hub.radius * (isBridge ? 1.35 : 0.9);

      var posX = Math.max(minX, Math.min(maxX, hub.x + Math.cos(angle) * distFromHub));
      var posY = Math.max(minY, Math.min(maxY, hub.y + Math.sin(angle) * distFromHub));

      var baseRadius = isBrand ? (Math.random() * 1.3 + 2.0) : (isDepthNode ? (Math.random() * 0.9 + 1.2) : (Math.random() * 1.1 + 1.4));
      if (isFooter) baseRadius = Math.max(1.1, baseRadius * 0.92);

      var speed = (Math.random() * 0.18 + 0.08) * (isMobile ? 0.6 : 1) * speedMultiplier;
      var moveAngle = Math.random() * Math.PI * 2;

      this.nodes.push({
        x: posX,
        y: posY,
        vx: Math.cos(moveAngle) * speed,
        vy: Math.sin(moveAngle) * speed,
        baseRadius: baseRadius,
        radius: baseRadius,
        isBrand: isBrand,
        isDepthNode: isDepthNode,
        isBridge: isBridge,
        hasGlow: hasGlow,
        alpha: (isDepthNode ? (Math.random() * 0.25 + 0.35) : (Math.random() * 0.32 + 0.38)) * (isFooter ? 0.85 : 1.0),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: (Math.random() * 0.024 + 0.014) * (isFooter ? 0.75 : 1.0),
        zDepth: isDepthNode ? 0.65 : (isBrand ? 1.0 : 0.85),
        clusterIdx: idx % this.clusterHubs.length
      });
    }

    // Background floating micro-particles (deepest layer 0.35x depth)
    if (this.particles.length > 0) {
      for (var p = 0; p < this.particles.length; p++) {
        var pt = this.particles[p];
        pt.x = Math.max(minX, Math.min(maxX, pt.x));
        pt.y = Math.max(minY, Math.min(maxY, pt.y));
      }
      if (this.particles.length > targetParticleCount) {
        this.particles.length = targetParticleCount;
      }
    }

    while (this.particles.length < targetParticleCount) {
      var pAngle = Math.random() * Math.PI * 2;
      var pSpeed = (Math.random() * 0.10 + 0.04) * speedMultiplier;
      this.particles.push({
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY,
        vx: Math.cos(pAngle) * pSpeed,
        vy: Math.sin(pAngle) * pSpeed,
        radius: Math.random() * 1.0 + 0.6,
        alpha: (Math.random() * 0.22 + 0.10) * (isFooter ? 0.85 : 1.0),
        color: (Math.random() < 0.45) ? BRAND_RED : LIGHT_SLATE,
        zDepth: 0.35
      });
    }

    this.pulses = [];
    this.ripples = [];
  };

  SectionTechCanvas.prototype.start = function () {
    if (this.isRunning || prefersReduced) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  };

  SectionTechCanvas.prototype.stop = function () {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };

  SectionTechCanvas.prototype.loop = function () {
    if (!this.isRunning) return;
    var self = this;
    self.rafId = requestAnimationFrame(function () {
      self.update();
      self.draw();
      self.loop();
    });
  };

  SectionTechCanvas.prototype.update = function () {
    var bounds = this.bounds;
    var minX = bounds.minX;
    var maxX = bounds.maxX;
    var minY = bounds.minY;
    var maxY = bounds.maxY;
    var isFooter = (this.variant === 'footer');

    // Smooth lerp for desktop pointer parallax
    this.parallax.currentX += (this.parallax.targetX - this.parallax.currentX) * 0.05;
    this.parallax.currentY += (this.parallax.targetY - this.parallax.currentY) * 0.05;

    // Smooth mouse position interpolation
    if (this.mouse.isInside) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;
    } else {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    }

    // 1. Update nodes with organic gentle drift & boundary soft bouncing
    for (var i = 0; i < this.nodes.length; i++) {
      var n = this.nodes[i];

      n.x += n.vx;
      n.y += n.vy;

      // Soft bounce on inner permitted bounds - never wrap or bleed outside
      if (n.x <= minX) {
        n.x = minX;
        n.vx = Math.abs(n.vx);
      } else if (n.x >= maxX) {
        n.x = maxX;
        n.vx = -Math.abs(n.vx);
      }

      if (n.y <= minY) {
        n.y = minY;
        n.vy = Math.abs(n.vy);
      } else if (n.y >= maxY) {
        n.y = maxY;
        n.vy = -Math.abs(n.vy);
      }

      // Organic breathing pulse for nodes
      n.pulsePhase += n.pulseSpeed;
      n.radius = n.baseRadius + Math.sin(n.pulsePhase) * 0.40;

      // Gentle interactive mouse repulsion
      if (this.mouse.isInside) {
        var dx = n.x - this.mouse.x;
        var dy = n.y - this.mouse.y;
        var distSq = dx * dx + dy * dy;
        var repulseRadius = isFooter ? 75 : 85;
        if (distSq < repulseRadius * repulseRadius && distSq > 0) {
          var dist = Math.sqrt(distSq);
          var force = (1 - dist / repulseRadius) * 1.0;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;

          // Re-clamp strictly within bounds after repulsion
          n.x = Math.max(minX, Math.min(maxX, n.x));
          n.y = Math.max(minY, Math.min(maxY, n.y));
        }
      }
    }

    // 2. Update background micro-particles
    for (var pIdx = 0; pIdx < this.particles.length; pIdx++) {
      var p = this.particles[pIdx];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= minX) {
        p.x = minX;
        p.vx = Math.abs(p.vx);
      } else if (p.x >= maxX) {
        p.x = maxX;
        p.vx = -Math.abs(p.vx);
      }

      if (p.y <= minY) {
        p.y = minY;
        p.vy = Math.abs(p.vy);
      } else if (p.y >= maxY) {
        p.y = maxY;
        p.vy = -Math.abs(p.vy);
      }
    }

    // 3. Update & spawn active glowing data pulses (calmer cadence on footer)
    var maxPulses = isFooter ? 3 : 6;
    var spawnChance = isFooter ? 0.025 : 0.05;

    if (this.pulses.length < maxPulses && Math.random() < spawnChance) {
      this.spawnPulse();
    }

    for (var pI = this.pulses.length - 1; pI >= 0; pI--) {
      var pulse = this.pulses[pI];
      pulse.progress += pulse.speed;

      // If pulse reaches destination node, chance to relay forward to an adjacent connected node
      if (pulse.progress >= 1) {
        if (Math.random() < (isFooter ? 0.28 : 0.38) && pulse.relayCount < 2) {
          var nextHop = this.findAdjacentTarget(pulse.to, pulse.from);
          if (nextHop) {
            pulse.from = pulse.to;
            pulse.to = nextHop.target;
            pulse.progress = 0;
            pulse.relayCount += 1;
            pulse.speed = (Math.random() * 0.014 + 0.014) * (100 / nextHop.dist) * (isFooter ? 0.8 : 1.0);
            continue;
          }
        }
        this.pulses.splice(pI, 1);
      }
    }

    // 4. Update periodic soft concentric ripple rings from cluster hubs
    this.rippleTimer += 1;
    var rippleThreshold = isFooter ? 450 : 280;

    if (this.rippleTimer > rippleThreshold && this.ripples.length < (isFooter ? 1 : 2)) {
      this.rippleTimer = 0;
      var glowingNodes = this.nodes.filter(function (nd) { return nd.hasGlow; });
      if (glowingNodes.length > 0) {
        var host = glowingNodes[Math.floor(Math.random() * glowingNodes.length)];
        this.ripples.push({
          x: host.x,
          y: host.y,
          host: host,
          radius: host.radius + 2,
          maxRadius: host.radius * (isFooter ? 6.0 : 7.5),
          alpha: isFooter ? 0.22 : 0.32,
          speed: isFooter ? 0.35 : 0.45
        });
      }
    }

    for (var rI = this.ripples.length - 1; rI >= 0; rI--) {
      var rip = this.ripples[rI];
      rip.radius += rip.speed;
      if (rip.host) {
        rip.x = rip.host.x;
        rip.y = rip.host.y;
      }
      var baseAlpha = isFooter ? 0.22 : 0.32;
      rip.alpha = (1 - (rip.radius / rip.maxRadius)) * baseAlpha;
      if (rip.radius >= rip.maxRadius || rip.alpha <= 0.01) {
        this.ripples.splice(rI, 1);
      }
    }
  };

  SectionTechCanvas.prototype.findAdjacentTarget = function (fromNode, prevNode) {
    var maxDistSq = this.maxDistance * this.maxDistance * 1.1;
    var candidates = [];

    for (var i = 0; i < this.nodes.length; i++) {
      var cand = this.nodes[i];
      if (cand === fromNode || cand === prevNode) continue;
      var dx = cand.x - fromNode.x;
      var dy = cand.y - fromNode.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < maxDistSq && d2 > 400) {
        candidates.push({ target: cand, dist: Math.sqrt(d2) });
      }
    }

    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return null;
  };

  SectionTechCanvas.prototype.spawnPulse = function () {
    var candidates = [];
    var maxDistSq = this.maxDistance * this.maxDistance;
    var isFooter = (this.variant === 'footer');

    for (var i = 0; i < this.nodes.length; i++) {
      for (var j = i + 1; j < this.nodes.length; j++) {
        var a = this.nodes[i];
        var b = this.nodes[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < maxDistSq && d2 > 600) {
          candidates.push({ from: a, to: b, dist: Math.sqrt(d2) });
        }
      }
    }

    if (candidates.length > 0) {
      var choice = candidates[Math.floor(Math.random() * candidates.length)];
      var reversed = Math.random() < 0.5;
      var speedScale = isFooter ? 0.78 : 1.0;

      this.pulses.push({
        from: reversed ? choice.to : choice.from,
        to: reversed ? choice.from : choice.to,
        progress: 0,
        speed: (Math.random() * 0.012 + 0.012) * (100 / choice.dist) * speedScale,
        size: isFooter ? (Math.random() * 0.6 + 1.6) : (Math.random() * 0.8 + 1.8),
        relayCount: 0
      });
    }
  };

  SectionTechCanvas.prototype.draw = function () {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    var isFooter = (this.variant === 'footer');

    // Hard clip strictly inside canvas container bounds
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip();

    var parX = this.parallax.currentX;
    var parY = this.parallax.currentY;

    // Subtlety alpha multiplier for footer
    var alphaScale = isFooter ? 0.72 : 1.0;

    // =========================================================================
    // LAYER 1: Deep Background Micro-Particles (z-depth 0.35x)
    // =========================================================================
    for (var ptIdx = 0; ptIdx < this.particles.length; ptIdx++) {
      var pt = this.particles[ptIdx];
      var pX = pt.x + parX * pt.zDepth;
      var pY = pt.y + parY * pt.zDepth;

      ctx.beginPath();
      ctx.arc(pX, pY, pt.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + pt.color + ', ' + (pt.alpha * alphaScale) + ')';
      ctx.fill();
    }

    // =========================================================================
    // LAYER 2: Network Connection Links with Dynamic Distance Fade
    // =========================================================================
    var maxDist = this.maxDistance;
    var maxDistSq = maxDist * maxDist;

    for (var i = 0; i < this.nodes.length; i++) {
      var na = this.nodes[i];
      var naX = na.x + parX * na.zDepth;
      var naY = na.y + parY * na.zDepth;

      for (var j = i + 1; j < this.nodes.length; j++) {
        var nb = this.nodes[j];
        var nbX = nb.x + parX * nb.zDepth;
        var nbY = nb.y + parY * nb.zDepth;

        var dx = naX - nbX;
        var dy = naY - nbY;
        var distSq = dx * dx + dy * dy;

        var effectiveMaxDistSq = (na.isBridge || nb.isBridge) ? (maxDistSq * 1.35) : maxDistSq;

        if (distSq < effectiveMaxDistSq) {
          var dist = Math.sqrt(distSq);
          var effectiveMaxDist = Math.sqrt(effectiveMaxDistSq);
          var distanceFactor = 1 - (dist / effectiveMaxDist);

          var smoothAlpha = Math.pow(distanceFactor, 1.5) * 0.28 * alphaScale;
          var isPrimary = na.isBrand || nb.isBrand;

          // Check if an active pulse is currently illuminating this link
          var isIlluminated = false;
          for (var pK = 0; pK < this.pulses.length; pK++) {
            var pulseItem = this.pulses[pK];
            if ((pulseItem.from === na && pulseItem.to === nb) || (pulseItem.from === nb && pulseItem.to === na)) {
              isIlluminated = true;
              break;
            }
          }

          ctx.beginPath();
          ctx.moveTo(naX, naY);
          ctx.lineTo(nbX, nbY);

          if (isIlluminated) {
            ctx.strokeStyle = 'rgba(' + BRAND_PALE_RED + ', ' + Math.min(smoothAlpha * 2.2 + 0.14, 0.60) + ')';
            ctx.lineWidth = isFooter ? 1.0 : 1.15;
          } else if (isPrimary) {
            ctx.strokeStyle = 'rgba(' + BRAND_RED + ', ' + smoothAlpha + ')';
            ctx.lineWidth = isFooter ? 0.85 : 0.95;
          } else {
            ctx.strokeStyle = 'rgba(' + LIGHT_SLATE + ', ' + (smoothAlpha * 0.72) + ')';
            ctx.lineWidth = isFooter ? 0.65 : 0.72;
          }
          ctx.stroke();
        }
      }
    }

    // =========================================================================
    // LAYER 3: Soft Concentric Ripple Rings from Cluster Hubs
    // =========================================================================
    for (var rIdx = 0; rIdx < this.ripples.length; rIdx++) {
      var rip = this.ripples[rIdx];
      var rX = rip.x + parX * 1.0;
      var rY = rip.y + parY * 1.0;

      ctx.beginPath();
      ctx.arc(rX, rY, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + BRAND_RED + ', ' + rip.alpha + ')';
      ctx.lineWidth = isFooter ? 0.85 : 1.0;
      ctx.stroke();
    }

    // =========================================================================
    // LAYER 4: Active Glowing Data Pulses with Luminous Motion Trails
    // =========================================================================
    for (var pIdx = 0; pIdx < this.pulses.length; pIdx++) {
      var pulse = this.pulses[pIdx];
      var fX = pulse.from.x + parX * pulse.from.zDepth;
      var fY = pulse.from.y + parY * pulse.from.zDepth;
      var tX = pulse.to.x + parX * pulse.to.zDepth;
      var tY = pulse.to.y + parY * pulse.to.zDepth;

      var curX = fX + (tX - fX) * pulse.progress;
      var curY = fY + (tY - fY) * pulse.progress;

      // Draw faint motion trail behind pulse
      var trailLength = isFooter ? 2 : 3;
      for (var tr = 1; tr <= trailLength; tr++) {
        var trProgress = Math.max(0, pulse.progress - (tr * 0.035));
        var trX = fX + (tX - fX) * trProgress;
        var trY = fY + (tY - fY) * trProgress;
        var trAlpha = (1 - (tr / (trailLength + 1))) * 0.32 * alphaScale;

        ctx.beginPath();
        ctx.arc(trX, trY, pulse.size * (1 - tr * 0.18), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + BRAND_RED + ', ' + trAlpha + ')';
        ctx.fill();
      }

      // Bright optical pulse core
      ctx.beginPath();
      ctx.arc(curX, curY, pulse.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + BRAND_RED + ', ' + (0.95 * alphaScale) + ')';
      ctx.fill();

      // Soft diffused glow
      ctx.beginPath();
      ctx.arc(curX, curY, pulse.size * (isFooter ? 2.4 : 2.8), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + BRAND_RED + ', ' + (0.25 * alphaScale) + ')';
      ctx.fill();

      // Micro white optical spark inside pulse
      ctx.beginPath();
      ctx.arc(curX, curY, pulse.size * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fill();
    }

    // =========================================================================
    // LAYER 5: Premium Network Nodes & Concentric Multi-Layer Halos
    // =========================================================================
    for (var nIdx = 0; nIdx < this.nodes.length; nIdx++) {
      var node = this.nodes[nIdx];
      var nX = node.x + parX * node.zDepth;
      var nY = node.y + parY * node.zDepth;

      // Soft layered ambient glow on designated cluster hubs
      if (node.hasGlow) {
        var glowRadius = node.radius * (isFooter ? 5.2 : 6.2);
        var glowGrad = ctx.createRadialGradient(nX, nY, 0, nX, nY, glowRadius);
        glowGrad.addColorStop(0, 'rgba(' + BRAND_RED + ', ' + (0.24 * alphaScale) + ')');
        glowGrad.addColorStop(0.4, 'rgba(' + BRAND_RED + ', ' + (0.08 * alphaScale) + ')');
        glowGrad.addColorStop(1, 'rgba(' + BRAND_RED + ', 0)');

        ctx.beginPath();
        ctx.arc(nX, nY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // Node solid body
      ctx.beginPath();
      ctx.arc(nX, nY, node.radius, 0, Math.PI * 2);

      if (node.isBrand) {
        ctx.fillStyle = 'rgba(' + BRAND_RED + ', ' + (node.alpha * alphaScale) + ')';
      } else if (node.isDepthNode) {
        ctx.fillStyle = 'rgba(' + SLATE_BLUE + ', ' + (node.alpha * 0.85 * alphaScale) + ')';
      } else {
        ctx.fillStyle = 'rgba(' + LIGHT_SLATE + ', ' + (node.alpha * 0.85 * alphaScale) + ')';
      }
      ctx.fill();

      // Outer micro-ring on gateway bridge nodes
      if (node.isBridge) {
        ctx.beginPath();
        ctx.arc(nX, nY, node.radius + (isFooter ? 2.0 : 2.4), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + BRAND_RED + ', ' + (0.32 * alphaScale) + ')';
        ctx.lineWidth = isFooter ? 0.75 : 0.85;
        ctx.stroke();
      }

      // Inner micro-white optical core on brand nodes
      if (node.isBrand && node.radius > 1.9) {
        ctx.beginPath();
        ctx.arc(nX, nY, 0.90, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
        ctx.fill();
      }
    }

    ctx.restore();
  };

  // Render static elegant snapshot for prefers-reduced-motion
  SectionTechCanvas.prototype.renderStatic = function () {
    this.update();
    this.draw();
  };

  // Factory initializer: mounts live tech canvas on all configured sections across website
  function initBaadamTechBackgrounds() {
    var targets = [
      { selector: '.hero-bg-decor', variant: 'hero' },
      { selector: '.about-bg-decor', variant: 'about' },
      { selector: '.services-bg-decor', variant: 'services' },
      { selector: '.approach-bg-decor', variant: 'approach' },
      { selector: '.team-bg-decor', variant: 'team' },
      { selector: '.page-bg-decor', variant: 'page' },
      { selector: '.footer-bg-decor', variant: 'footer' }
    ];

    targets.forEach(function (t) {
      var containers = document.querySelectorAll(t.selector);
      containers.forEach(function (container) {
        // Prevent duplicate canvas instances
        if (container.querySelector('.baadam-tech-canvas')) return;
        new SectionTechCanvas(container, { variant: t.variant });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBaadamTechBackgrounds);
  } else {
    initBaadamTechBackgrounds();
  }
})();
