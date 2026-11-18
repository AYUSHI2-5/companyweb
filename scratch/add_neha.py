with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = """          <!-- Member 4 -->
          <article class="team-card scroll-reveal" style="width: 100%;">
            <div class="team-card-image-wrap">
              <img src="assets/team-sanjay.jpg" alt="Sanjay Vaja - Flutter Developer" class="team-card-img" width="290" height="310">
            </div>
            <div class="team-card-content">
              <h3 class="team-card-name">Sanjay Vaja</h3>
              <div class="team-card-role">Flutter Developer</div>
              <p class="team-card-desc">Specializes in cross-platform mobile architecture, high-performance Flutter applications, and seamless API integrations.</p>
            </div>
          </article>"""

replacement = """          <!-- Member 4 -->
          <article class="team-card scroll-reveal" style="width: 100%;">
            <div class="team-card-image-wrap">
              <img src="assets/team-sanjay.jpg" alt="Sanjay Vaja - Flutter Developer" class="team-card-img" width="290" height="310">
            </div>
            <div class="team-card-content">
              <h3 class="team-card-name">Sanjay Vaja</h3>
              <div class="team-card-role">Flutter Developer</div>
              <p class="team-card-desc">Specializes in cross-platform mobile architecture, high-performance Flutter applications, and seamless API integrations.</p>
            </div>
          </article>

          <!-- Member 5 -->
          <article class="team-card scroll-reveal" style="width: 100%;">
            <div class="team-card-image-wrap">
              <img src="assets/team-neha.jpg" alt="Neha Shah - Digital Marketing Specialist" class="team-card-img" width="290" height="310">
            </div>
            <div class="team-card-content">
              <h3 class="team-card-name">Neha Shah</h3>
              <div class="team-card-role">Digital Marketing Specialist</div>
              <p class="team-card-desc">Maximizes client reach through data-backed performance marketing and technical SEO strategies.</p>
            </div>
          </article>"""

# Normalize \r\n to \n for matching
is_crlf = '\r\n' in text
text_norm = text.replace('\r\n', '\n')
if target in text_norm:
    text_norm = text_norm.replace(target, replacement)
    if is_crlf:
        text_norm = text_norm.replace('\n', '\r\n')
    with open('about.html', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print('Successfully added Neha Shah to about.html!')
else:
    print('Target not found in text_norm')

