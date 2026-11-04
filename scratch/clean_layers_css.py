with open('style.css', 'r', encoding='utf-8') as f:
    c = f.read()

import re
pattern = r'/\* Stationary Avatar Container \(Firmly anchored at bottom-left\) \*/[\s\S]*?filter: drop-shadow\(0 6px 16px rgba\(0, 0, 0, 0\.08\)\);\s*\}'

replacement = '''/* Stationary Avatar Container (Body remains 100% motionless) */
.teacher-avatar-wrapper {
  position: relative;
  width: 150px;
  height: 195px;
  pointer-events: none;
  transform: none !important;
}

/* 1. Static Body Layer (Head, Bun, Glasses, Collar, Torso, Tablet, Legs) */
.teacher-body-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  pointer-events: none;
  z-index: 2; /* Sleeve cuff sits on top of forearm socket to conceal rotation anchor */
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.12));
  transform: none !important;
}

/* 2. Independently Animated Stylus-Holding Arm Layer */
.teacher-arm-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Forearm rotates inside sleeve cuff */
  transform-origin: 84.8% 43.7%; /* Sleeve cuff rotation pivot */
  pointer-events: none;
  will-change: transform;
}

/* 3. Fine Wrist & Stylus Articulation (Explaining Orbit, Highlighting Emphasis) */
.teacher-wrist-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 86% 36%; /* Wrist knuckle articulation */
  will-change: transform;
  pointer-events: none;
}

.teacher-arm-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  pointer-events: none;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.08));
}'''

new_c, count = re.subn(pattern, replacement, c)
print(f'Replacements in style.css: {count}')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(new_c)

