with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update hero-lens-circle definition
old_circle = """.hero-lens-circle {
  position: relative;
  width: min(clamp(380px, 50vw, 560px), 54vh);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 2px solid #E7192D;
  box-shadow: 0 0 35px rgba(231, 25, 45, 0.25), inset 0 0 25px rgba(231, 25, 45, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 28px;
  margin: 6px 0 10px;
  /* Translucent Optical Spotlight on White Theme */
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.96) 0%, rgba(255, 245, 246, 0.88) 60%, rgba(255, 255, 255, 0.75) 100%);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.hero-lens-circle:hover {
  border-color: #ff2b44;
  box-shadow: 0 0 45px rgba(231, 25, 45, 0.35), inset 0 0 30px rgba(231, 25, 45, 0.14);
}"""

new_circle = """.hero-lens-circle {
  position: relative;
  /* 25-30% larger diameter: expanded from 54vh/560px to 67.5vh/715px */
  width: min(clamp(480px, 64vw, 715px), 67.5vh);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 3px solid #E7192D;
  box-shadow: 0 0 42px rgba(231, 25, 45, 0.28), 0 0 85px rgba(255, 62, 136, 0.14), inset 0 0 30px rgba(231, 25, 45, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 4.5vh, 46px) clamp(28px, 4.5vw, 54px);
  margin: 4px 0 8px;
  /* Translucent Optical Spotlight on White Theme */
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.96) 0%, rgba(255, 245, 246, 0.88) 60%, rgba(255, 255, 255, 0.75) 100%);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.hero-lens-circle:hover {
  border-color: #ff2b44;
  box-shadow: 0 0 55px rgba(231, 25, 45, 0.38), 0 0 110px rgba(255, 62, 136, 0.22), inset 0 0 40px rgba(231, 25, 45, 0.14);
}"""

# 2. Update circle-radar-target and top badge
old_targets = """/* Perimeter Radar Target Badge - Centered Above the Booking Badge */
.circle-radar-target {
  position: absolute;
  top: -54px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  z-index: 15;
  white-space: nowrap;
}"""

new_targets = """/* Perimeter Radar Target Badge - Centered Above the Booking Badge */
.circle-radar-target {
  position: absolute;
  top: -46px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  z-index: 15;
  white-space: nowrap;
}"""

old_top_badge = """.hero-top-badge {
  position: absolute;
  top: -24px;"""

new_top_badge = """.hero-top-badge {
  position: absolute;
  top: -20px;"""

# 3. Update floating badges
old_pills = """/* Left Pill: Placed Outside on the Left Edge */
.float-pill.pill-left {
  top: 30%;
  right: calc(100% + 18px);
  left: auto;
  animation-delay: 0s;
}

.float-pill.pill-left .circle-ring-anchor {
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
}

/* Top-Right Pill: Placed Outside on the Right Edge */
.float-pill.pill-top-right {
  top: 14%;
  left: calc(100% + 18px);
  right: auto;
  animation-delay: 1.2s;
}

.float-pill.pill-top-right .circle-ring-anchor {
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
}

/* Bottom-Right Pill: Placed Outside on the Right Edge */
.float-pill.pill-bottom-right {
  bottom: 18%;
  left: calc(100% + 18px);
  right: auto;
  animation-delay: 2.1s;
}

.float-pill.pill-bottom-right .circle-ring-anchor {
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
}"""

new_pills = """/* Left Pill: Placed Outside on the Left Edge */
.float-pill.pill-left {
  top: 32%;
  right: calc(100% + 22px);
  left: auto;
  animation-delay: 0s;
}

.float-pill.pill-left .circle-ring-anchor {
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
}

/* Top-Right Pill: Placed Outside on the Right Edge */
.float-pill.pill-top-right {
  top: 15%;
  left: calc(100% + 22px);
  right: auto;
  animation-delay: 1.2s;
}

.float-pill.pill-top-right .circle-ring-anchor {
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
}

/* Bottom-Right Pill: Placed Outside on the Right Edge */
.float-pill.pill-bottom-right {
  bottom: 20%;
  left: calc(100% + 22px);
  right: auto;
  animation-delay: 2.1s;
}

.float-pill.pill-bottom-right .circle-ring-anchor {
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
}"""

# 4. Update headline and description sizing inside enlarged circle
old_typography = """/* Central Headline Sized to Fit Generously Inside the Circle */
.hero-lens-headline {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 1.75vw, 1.75rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #111827;
  margin-bottom: 8px;
  max-width: 460px;
  text-align: center;
}

/* The Single-Line Highlight Pill */
.hero-lime-tag {
  display: inline-block;
  background-color: #E7192D;
  color: #FFFFFF;
  padding: 2px 14px 3px;
  border-radius: 9999px;
  font-size: 0.9em;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: 0 3px 12px rgba(231, 25, 45, 0.32);
  transform: translateY(-2px);
  text-shadow: none;
  white-space: nowrap;
}

/* Subtitle description */
.hero-lens-desc {
  font-size: clamp(0.74rem, 0.82vw, 0.82rem);
  line-height: 1.36;
  color: #4b5563;
  max-width: 380px;
  margin: 0 auto 12px;
  font-weight: 500;
  text-align: center;
}"""

new_typography = """/* Central Headline Sized to Fit Generously Inside the Enlarged Circle */
.hero-lens-headline {
  font-family: var(--font-display);
  font-size: clamp(1.32rem, 1.95vw, 1.98rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: #111827;
  margin-bottom: 10px;
  max-width: 520px;
  text-align: center;
}

/* The Single-Line Highlight Pill */
.hero-lime-tag {
  display: inline-block;
  background-color: #E7192D;
  color: #FFFFFF;
  padding: 3px 16px 4px;
  border-radius: 9999px;
  font-size: 0.88em;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: 0 3px 12px rgba(231, 25, 45, 0.32);
  transform: translateY(-2px);
  text-shadow: none;
  white-space: nowrap;
}

/* Subtitle description */
.hero-lens-desc {
  font-size: clamp(0.76rem, 0.84vw, 0.86rem);
  line-height: 1.42;
  color: #4b5563;
  max-width: 480px;
  margin: 0 auto 14px;
  font-weight: 500;
  text-align: center;
}"""

# Normalise CRLF
css = css.replace('\r\n', '\n')
css = css.replace(old_circle, new_circle)
css = css.replace(old_targets, new_targets)
css = css.replace(old_top_badge, new_top_badge)
css = css.replace(old_pills, new_pills)
css = css.replace(old_typography, new_typography)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Enlarged hero central circle by ~28% in style.css successfully")

