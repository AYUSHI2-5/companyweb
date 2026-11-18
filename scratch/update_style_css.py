with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update body overflow-x to clip
target_body = '''body {
  font-family: var(--font-sans);
  background-color: var(--bg-body);
  color: var(--text-chalk);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}'''

replacement_body = '''body {
  font-family: var(--font-sans);
  background-color: var(--bg-body);
  color: var(--text-chalk);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: clip;
  position: relative;
}'''

# 2. Add services sticky track styles
target_services = '''/* ==========================================================================
   12. Interactive Services Accordion (Reachwise Reference Layout)
   Visual: Soft Chalk Cream background (#EEEEE8), multi-colored pills,
   elevated active card (#DFE0D7), interactive UI mockups, bottom stepper
   ========================================================================== */
.services-section {'''

replacement_services = '''/* ==========================================================================
   12. Interactive Services Accordion (Reachwise Reference Layout)
   Sticky Multi-Step Scroll Track: Pinned cards step-by-step
   ========================================================================== */
.services-sticky-track {
  position: relative;
  width: 100%;
  height: 600vh; /* 6 cards: 100vh per card step */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.services-snap-stops-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  display: flex;
  flex-direction: column;
}

.services-snap-stop {
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  pointer-events: none;
}

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

.services-section.services-pinned-content::-webkit-scrollbar {
  display: none;
}

@media (max-width: 900px) {
  .services-sticky-track {
    height: auto;
  }
  .services-snap-stops-wrap {
    display: none;
  }
  .services-section.services-pinned-content {
    position: relative;
    top: auto;
    height: auto;
    max-height: none;
    overflow: visible;
  }
}

.services-section {'''

normalized_content = content.replace('\r\n', '\n')
norm_tb = target_body.replace('\r\n', '\n')
norm_rb = replacement_body.replace('\r\n', '\n')
norm_ts = target_services.replace('\r\n', '\n')
norm_rs = replacement_services.replace('\r\n', '\n')

assert norm_tb in normalized_content, "target_body not found in style.css"
assert norm_ts in normalized_content, "target_services not found in style.css"

new_content = normalized_content.replace(norm_tb, norm_rb, 1)
new_content = new_content.replace(norm_ts, norm_rs, 1)

with open('style.css', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_content)

print("Successfully updated style.css!")

