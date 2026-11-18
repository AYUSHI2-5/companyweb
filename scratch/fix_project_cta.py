import os
import re

old_cta_pattern = r'<!-- Section 8: Final CTA Banner -->\s*<section class="section-pad cta-banner-section" aria-labelledby="cta-heading">\s*<div class="section-container">\s*<div class="cta-banner-card">.*?</div>\s*</div>\s*</div>\s*</div>\s*</section>'

clean_cta = '''<!-- Section 8: Final CTA Banner -->
    <section class="section-pad cta-banner-section" aria-labelledby="cta-heading">
      <div class="section-container">
        <div class="cta-banner-card scroll-reveal">
          <div class="cta-banner-content">
            <div class="cta-banner-text">
              <div class="kicker-capsule">
                <span>[ START A COLLABORATION ]</span>
              </div>
              <h2 class="cta-banner-heading" id="cta-heading">
                Have a Project in Mind?<br>Let's Build It Together.
              </h2>
              <p class="cta-banner-desc">
                Have an idea or a business challenge? Let's discuss how Baadam can help turn your vision into reality.
              </p>
              <div class="cta-banner-btn-wrap">
                <a href="../../contact.html" class="btn-pill btn-primary-pill" aria-label="Let's Talk">
                  <span>Let's Talk</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <div class="cta-banner-visual">
              <div class="cta-image-wrapper">
                <img src="../../assets/cta-collaboration.jpg" alt="Technical discovery and planning" class="cta-collab-img" width="460" height="280">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>'''

project_dirs = [d for d in os.listdir('projects') if os.path.isdir(os.path.join('projects', d))]
updated = 0

for pdir in project_dirs:
    pfile = os.path.join('projects', pdir, 'index.html')
    with open(pfile, 'r', encoding='utf-8') as f:
        html = f.read()

    # Search for section 8
    pos_cta = html.find('<!-- Section 8: Final CTA Banner -->')
    pos_main_end = html.find('</main>')

    if pos_cta != -1 and pos_main_end != -1:
        new_html = html[:pos_cta] + clean_cta + '\n  ' + html[pos_main_end:]
        with open(pfile, 'w', encoding='utf-8') as f:
            f.write(new_html)
        updated += 1
        print(f"Updated CTA in: {pfile}")
    else:
        print(f"Could not locate CTA section in {pfile}")

print(f"\nSuccessfully updated CTA banner across all {updated} project pages!")

