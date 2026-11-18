with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update .services-section.services-pinned-content
target_pinned = """
.services-section.services-pinned-content {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  z-index: 2;
  box-sizing: border-box;
  scroll-snap-align: none !important;
  scroll-snap-stop: normal !important;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
""".strip()

replacement_pinned = """
.services-section.services-pinned-content {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  z-index: 2;
  box-sizing: border-box;
  scroll-snap-align: none !important;
  scroll-snap-stop: normal !important;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
""".strip()

if target_pinned in text:
    text = text.replace(target_pinned, replacement_pinned, 1)
    print("Replaced pinned content overflow successfully!")
else:
    print("Target pinned content not found!")

# 2. Update Accordion items & body
pos1 = text.find('/* Accordion Item Base */')
pos2 = text.find('/* Left Column: Interactive Browser UI Mockup */')

old_block = text[pos1:pos2]

new_block = """/* Accordion Item Base */
.service-acc-item {
  border-radius: 9999px;
  transition: border-radius 0.42s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.35s ease,
              border-color 0.35s ease,
              box-shadow 0.35s ease,
              padding 0.42s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.3s ease;
  overflow: hidden;
  position: relative;
  will-change: border-radius, background-color, box-shadow;
}

/* Collapsed Header / Pill Row */
.service-acc-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  outline: none;
  font-family: inherit;
  transition: padding 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}

.acc-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.acc-badge-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  transform-origin: center center;
}

.acc-title {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color 0.3s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: left center;
}

/* Themed Collapsed Row Variants */
.service-acc-item:not(.is-active) {
  border-radius: 9999px;
}

/* 1. White & Red Border Pill (02 Social Media / 05 Web Design) */
.service-acc-dark:not(.is-active) {
  background: #FFFFFF;
  color: #111827;
  border: 1px solid rgba(231, 25, 45, 0.25);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.service-acc-dark:not(.is-active) .acc-title {
  color: #111827;
}

.service-acc-dark:not(.is-active) .acc-badge-index {
  background: rgba(231, 25, 45, 0.1);
  color: #E7192D;
}

.service-acc-dark:not(.is-active):hover {
  background: #FFFFFF;
  border-color: #E7192D;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(231, 25, 45, 0.12);
}

/* 2. White Pill (01 SEO when collapsed / 03 Paid Ads) */
.service-acc-white:not(.is-active) {
  background: #FFFFFF;
  color: #0D0E10;
  border: 1px solid rgba(13, 14, 16, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.service-acc-white:not(.is-active) .acc-title {
  color: #0D0E10;
}

.service-acc-white:not(.is-active) .acc-badge-index {
  background: #EEEEE8;
  color: #0D0E10;
}

.service-acc-white:not(.is-active):hover {
  border-color: rgba(13, 14, 16, 0.2);
  transform: translateY(-2px);
}

/* 3. Red Accent Pill (04 Content) */
.service-acc-lime:not(.is-active) {
  background: #E53935;
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(229, 57, 53, 0.25);
}

.service-acc-lime:not(.is-active) .acc-title {
  color: #FFFFFF;
}

.service-acc-lime:not(.is-active) .acc-badge-index {
  background: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.service-acc-lime:not(.is-active):hover {
  background: #ff453a;
  transform: translateY(-2px);
}

/* 4. Light Grey Pill (06 Branding) */
.service-acc-light:not(.is-active) {
  background: #F4F4EE;
  color: #0D0E10;
  border: 1px solid #DFE0D7;
}

.service-acc-light:not(.is-active) .acc-title {
  color: #0D0E10;
}

.service-acc-light:not(.is-active) .acc-badge-index {
  background: #DFE0D7;
  color: #0D0E10;
}

.service-acc-light:not(.is-active):hover {
  background: #FFFFFF;
  transform: translateY(-2px);
}

/* Active Elevated Card Styling (Regardless of variant) */
.service-acc-item.is-active {
  background: #DFE0D7;
  color: #0D0E10;
  border-radius: 18px;
  padding: 10px 18px 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.service-acc-item.is-active .service-acc-header {
  padding: 0 0 6px 0;
  cursor: default;
}

.service-acc-item.is-active .acc-badge-index {
  background: #E53935;
  color: #FFFFFF;
  transform: scale(1.06);
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.4);
}

.service-acc-item.is-active .acc-title {
  font-weight: 800;
  color: #0D0E10;
  transform: scale(1.08);
}

/* Collapsible Body with Butter-Smooth Fluid Transition */
.service-acc-body {
  display: grid;
  grid-template-rows: 0fr;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.28s ease;
  will-change: grid-template-rows, max-height, opacity;
}

.service-acc-item.is-active .service-acc-body {
  grid-template-rows: 1fr;
  max-height: 800px;
  opacity: 1;
  transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
}

.acc-body-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 16px;
  align-items: stretch;
  padding: 0;
  min-height: 0;
  overflow: hidden;
  transform: translateY(6px);
  opacity: 0.85;
  transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.service-acc-item.is-active .acc-body-grid {
  transform: translateY(0);
  opacity: 1;
}

"""

text = text[:pos1] + new_block + text[pos2:]

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated style.css successfully!")
open_b = text.count('{')
close_b = text.count('}')
print(f"Braces balance: {open_b} open, {close_b} close (delta: {open_b - close_b})")

