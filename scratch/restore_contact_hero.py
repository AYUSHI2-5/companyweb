with open('contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

hero_start = '<!-- Page Hero -->'
hero_end = '<!-- Contact Form & Studio Details Grid -->'

exact_hero = '''<!-- Page Hero -->
    <section class="page-hero contact-page-hero">
      <div class="page-hero-container scroll-reveal">
        <div class="kicker-capsule">
          <i class="radar-dot" aria-hidden="true"></i>
          <span>START A PROJECT &middot; IT CONSULTATION</span>
        </div>
        <h1 class="page-title">
          Let's Build Something<br>
          <span class="text-brand-red">Scalable &amp; Transformative.</span>
        </h1>
        <p class="page-lead">
          Have an upcoming software product, want to develop a mobile app, rebuild your web platform, or accelerate your digital marketing? Share your technical brief with our team in Ahmedabad.
        </p>

        <!-- 3 Key Trust Metrics for IT Clients -->
        <div class="contact-trust-bar">
          <div class="trust-badge-item">
            <span class="trust-badge-icon">&#9889;</span>
            <div class="trust-badge-text">
              <strong>24-Hour Response</strong>
              <span>Technical feasibility &amp; architect review</span>
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
              <span>Fixed milestones or dedicated squads</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    '''

idx1 = content.find(hero_start)
idx2 = content.find(hero_end)
if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + exact_hero + content[idx2:]
    with open('contact.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('contact.html hero restored successfully')
else:
    print('Could not find hero markers')

