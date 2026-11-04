with open('contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the hero section
old_hero_start = '<!-- Page Hero -->'
old_hero_end = '<!-- Contact Form & Studio Details Grid -->'

new_hero = '''<!-- Page Hero -->
    <section class="page-hero contact-page-hero">
      <div class="page-hero-container">
        <!-- Section Header matching Services style -->
        <div class="services-showcase-header contact-showcase-header scroll-reveal">
          <h1 class="services-showcase-title" id="contact-main-heading">Contact Us</h1>
          <p class="services-showcase-subtitle">
            Have an upcoming project or want to collaborate with our team? Reach out to us for website, application, software development, and digital marketing inquiries.
          </p>
          <div class="services-accent-wrap" aria-hidden="true">
            <svg class="services-accent-svg" width="60" height="12" viewBox="0 0 60 12" fill="none">
              <path d="M2 8H24L30 2L36 8H58" stroke="#EB163C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- 3 Key Trust Metrics for IT Clients -->
        <div class="contact-trust-bar scroll-reveal">
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#9889;</span>
            <div class="trust-badge-text">
              <strong>24-Hour Response</strong>
              <span>Quick technical review &amp; consultation</span>
            </div>
          </div>
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#128274;</span>
            <div class="trust-badge-text">
              <strong>100% NDA Protected</strong>
              <span>Strict IP &amp; data privacy guaranteed</span>
            </div>
          </div>
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#127919;</span>
            <div class="trust-badge-text">
              <strong>Flexible Engagements</strong>
              <span>Dedicated teams or milestone delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    '''

idx1 = content.find(old_hero_start)
idx2 = content.find(old_hero_end)
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + new_hero + content[idx2:]
    print('Hero replaced successfully')
else:
    print('Failed to find hero markers')

# Replace form header badge
content = content.replace('[ IT PROJECT SCOPE &amp; INQUIRY ]', '[ DIRECT INQUIRY ]')

# Update services pills to match services.html exactly
old_pills = '''                  <button type="button" class="service-pill" data-value="Website Development">
                    <span class="pill-check">&#10003;</span> Website Development
                  </button>
                  <button type="button" class="service-pill" data-value="Mobile Application Development">
                    <span class="pill-check">&#10003;</span> Mobile App (iOS / Android)
                  </button>
                  <button type="button" class="service-pill" data-value="Custom Software & ERP">
                    <span class="pill-check">&#10003;</span> Software / ERP Development
                  </button>
                  <button type="button" class="service-pill" data-value="Digital Marketing & SEO">
                    <span class="pill-check">&#10003;</span> Digital Marketing &amp; SEO
                  </button>
                  <button type="button" class="service-pill" data-value="E-Commerce Development">
                    <span class="pill-check">&#10003;</span> E-Commerce Solutions
                  </button>
                  <button type="button" class="service-pill" data-value="Game Development">
                    <span class="pill-check">&#10003;</span> Game Development (Unity 3D)
                  </button>
                  <button type="button" class="service-pill" data-value="UI/UX Product Design">
                    <span class="pill-check">&#10003;</span> UI/UX Design &amp; Audit
                  </button>
                  <button type="button" class="service-pill" data-value="Cloud & DevOps">
                    <span class="pill-check">&#10003;</span> Cloud / API Integration
                  </button>'''

new_pills = '''                  <button type="button" class="service-pill" data-value="Website Development">
                    <span class="pill-check">&#10003;</span> Website Development
                  </button>
                  <button type="button" class="service-pill" data-value="Application Development">
                    <span class="pill-check">&#10003;</span> Application Development
                  </button>
                  <button type="button" class="service-pill" data-value="Digital Marketing">
                    <span class="pill-check">&#10003;</span> Digital Marketing
                  </button>
                  <button type="button" class="service-pill" data-value="E-Commerce Development">
                    <span class="pill-check">&#10003;</span> E-Commerce Development
                  </button>
                  <button type="button" class="service-pill" data-value="Software Development">
                    <span class="pill-check">&#10003;</span> Software Development
                  </button>
                  <button type="button" class="service-pill" data-value="Game Development">
                    <span class="pill-check">&#10003;</span> Game Development
                  </button>
                  <button type="button" class="service-pill" data-value="UI/UX Design">
                    <span class="pill-check">&#10003;</span> UI/UX Design
                  </button>
                  <button type="button" class="service-pill" data-value="Cloud & DevOps">
                    <span class="pill-check">&#10003;</span> Cloud &amp; DevOps
                  </button>'''

if old_pills in content:
    content = content.replace(old_pills, new_pills)
    print('Pills replaced successfully')
else:
    print('Old pills exact match not found')

# Update Section 4 title and placeholder
content = content.replace('04 / Project Brief &amp; Technical Requirements *', '04 / Project Brief &amp; Message *')
content = content.replace('placeholder="Describe your project vision, target audience, core features, existing systems, or technology preferences..."', 'placeholder="Tell us about your project vision, core requirements, timeline, or any questions for our team..."')
content = content.replace('Please send a mutual <strong>Non-Disclosure Agreement (NDA)</strong> prior to detailed technical discussions.', 'Please send a mutual <strong>Non-Disclosure Agreement (NDA)</strong> before detailed discussions.')
content = content.replace('<span>Submit Technical Inquiry</span>', '<span>Send Message</span>')

# Update Sidebar Cards
content = content.replace('<h3 class="contact-card-title">Architectural Scoping Call</h3>', '<h3 class="contact-card-title">Schedule a Consultation</h3>')
content = content.replace('<span>Request Video Scoping Call</span>', '<span>Request Video Call</span>')
content = content.replace('Prefer a real-time discussion? Schedule a 20-minute video conference with our solutions architects to assess technical feasibility.', 'Prefer a real-time discussion? Schedule a 20-minute video conference with our solutions team to discuss your project requirements.')
content = content.replace('Opp Doordarshan kendra,', 'Opp Doordarshan Kendra,')

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('contact.html written successfully')

