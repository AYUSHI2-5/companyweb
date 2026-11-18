import glob
import re

canonical_project_cta = """    <!-- Final CTA Banner -->
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
                From high-throughput fintech platforms to scalable enterprise applications, Baadam engineers robust software systems that drive tangible business growth.
              </p>
              <div class="cta-banner-btn-wrap">
                <a href="../../contact.html" class="btn-pill btn-primary-pill" aria-label="Schedule a Consultation with Baadam">
                  <span>Schedule a Consultation</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <div class="cta-banner-visual">
              <div class="cta-image-wrapper">
                <img src="../../assets/cta-collaboration.jpg" alt="Business consultation and technical collaboration at Baadam" class="cta-collab-img" width="460" height="280">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>"""

# 1. Update all 16 project pages
project_files = glob.glob('projects/*/index.html')
for pf in project_files:
    with open(pf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace CTA banner section
    pattern = r'<!-- Final CTA Banner -->[\s\S]*?</section>'
    if re.search(pattern, content):
        content = re.sub(pattern, canonical_project_cta, content)
        with open(pf, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated CTA in {pf}')
    else:
        print(f'Pattern not matched in {pf}')

# 2. Update generators
for gen in ['scratch/generate_refined_cms_pages.py', 'scratch/generate_full_cms_pages.py']:
    try:
        with open(gen, 'r', encoding='utf-8') as f:
            gcontent = f.read()
        if re.search(pattern, gcontent):
            gcontent = re.sub(pattern, canonical_project_cta, gcontent)
            with open(gen, 'w', encoding='utf-8') as f:
                f.write(gcontent)
            print(f'Updated {gen}')
    except Exception as e:
        print(f'Error updating {gen}: {e}')

print('All CTA banners updated successfully!')

