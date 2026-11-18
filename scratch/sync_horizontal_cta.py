import glob
import re

canonical_project_cta = """    <!-- Final CTA Banner (Universal Studio Component) -->
    <section class="section-pad cta-banner-section" aria-labelledby="cta-heading">
      <div class="section-container">
        <div class="cta-banner-card scroll-reveal">
          <div class="cta-banner-content cta-horizontal-layout">
            <div class="cta-banner-text">
              <div class="kicker-capsule">
                <span>[ START A COLLABORATION ]</span>
              </div>
              <h2 class="cta-banner-heading" id="cta-heading">
                Have a Project in Mind?<br>Let's Build It Together.
              </h2>
              <p class="cta-banner-desc">
                From high-throughput fintech platforms to scalable enterprise applications, Baadam engineers robust software systems that drive tangible business growth.
              </p>
            </div>
            <div class="cta-banner-actions">
              <a href="../../contact.html" class="btn-pill btn-primary-pill" aria-label="Schedule a Consultation with Baadam">
                <span>Schedule a Consultation</span>
                <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>"""

project_files = glob.glob('projects/*/index.html')
for pf in project_files:
    with open(pf, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'<!-- Final CTA Banner.*?-->[\s\S]*?</section>'
    if re.search(pattern, content):
        content = re.sub(pattern, canonical_project_cta, content)
        with open(pf, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Synced CTA in {pf}')
    else:
        print(f'Warning: CTA not found in {pf}')
