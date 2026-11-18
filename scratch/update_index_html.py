with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''    <!-- =====================================================================
         Section 2: Services (Reachwise Reference Interactive Accordion)
         ===================================================================== -->
    <section class="services-section" id="services-section" aria-labelledby="services-main-heading">'''

replacement1 = '''    <!-- =====================================================================
         Section 2: Services (Reachwise Reference Interactive Accordion)
         Sticky Multi-Step Scroll Track: Pinned cards step-by-step
         ===================================================================== -->
    <div class="services-sticky-track" id="services-sticky-track">
      <!-- Invisible snap stops for CSS scroll-snap step-by-step locking -->
      <div class="services-snap-stops-wrap" aria-hidden="true">
        <div class="services-snap-stop" data-step="0"></div>
        <div class="services-snap-stop" data-step="1"></div>
        <div class="services-snap-stop" data-step="2"></div>
        <div class="services-snap-stop" data-step="3"></div>
        <div class="services-snap-stop" data-step="4"></div>
        <div class="services-snap-stop" data-step="5"></div>
      </div>

      <section class="services-section services-pinned-content" id="services-section" aria-labelledby="services-main-heading">'''

target2 = '''        <!-- Bottom Stepper Progress Indicator -->
        <div class="services-stepper-bar">
          <div class="acc-stepper-tracks" aria-label="Services Progress">
            <div class="acc-stepper-segment is-active" data-step="1"></div>
            <div class="acc-stepper-segment" data-step="2"></div>
            <div class="acc-stepper-segment" data-step="3"></div>
            <div class="acc-stepper-segment" data-step="4"></div>
            <div class="acc-stepper-segment" data-step="5"></div>
            <div class="acc-stepper-segment" data-step="6"></div>
          </div>
          <div class="acc-stepper-counter">
            <span class="stepper-badge">01 / 06</span>
            <span class="stepper-name">Website Development</span>
          </div>
        </div>
      </div>
    </section>'''

replacement2 = '''        <!-- Bottom Stepper Progress Indicator -->
        <div class="services-stepper-bar">
          <div class="acc-stepper-tracks" aria-label="Services Progress">
            <div class="acc-stepper-segment is-active" data-step="1"></div>
            <div class="acc-stepper-segment" data-step="2"></div>
            <div class="acc-stepper-segment" data-step="3"></div>
            <div class="acc-stepper-segment" data-step="4"></div>
            <div class="acc-stepper-segment" data-step="5"></div>
            <div class="acc-stepper-segment" data-step="6"></div>
          </div>
          <div class="acc-stepper-counter">
            <span class="stepper-badge">01 / 06</span>
            <span class="stepper-name">Website Development</span>
          </div>
        </div>
      </div>
    </section>
  </div>'''

# Normalize newlines for matching
normalized_content = content.replace('\r\n', '\n')
norm_target1 = target1.replace('\r\n', '\n')
norm_target2 = target2.replace('\r\n', '\n')
norm_rep1 = replacement1.replace('\r\n', '\n')
norm_rep2 = replacement2.replace('\r\n', '\n')

assert norm_target1 in normalized_content, "target1 not found in index.html"
assert norm_target2 in normalized_content, "target2 not found in index.html"

new_content = normalized_content.replace(norm_target1, norm_rep1, 1)
new_content = new_content.replace(norm_target2, norm_rep2, 1)

# Also bump cache busters in index.html
new_content = new_content.replace('style.css?v=26', 'style.css?v=27')
new_content = new_content.replace('services-accordion.js', 'services-accordion.js?v=27')
new_content = new_content.replace('main.js?v=21', 'main.js?v=27')
new_content = new_content.replace('main.js?v=25', 'main.js?v=27')

# Restore CRLF
with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_content)

print("Successfully updated index.html!")

