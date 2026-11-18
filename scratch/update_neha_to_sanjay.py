with open('about.html', 'r', encoding='utf-8') as f:
    txt = f.read()

txt = txt.replace('alt="Neha Shah - Digital Marketing Specialist"', 'alt="Sanjay Vaja - Flutter Developer"')
txt = txt.replace('src="assets/team-neha.jpg"', 'src="assets/team-sanjay.jpg"')
txt = txt.replace('<h3 class="team-card-name">Neha Shah</h3>', '<h3 class="team-card-name">Sanjay Vaja</h3>')
txt = txt.replace('<div class="team-card-role">Digital Marketing Specialist</div>', '<div class="team-card-role">Flutter Developer</div>')
txt = txt.replace(
    '<p class="team-card-desc">Maximizes client reach through data-backed performance marketing and technical SEO strategies.</p>',
    '<p class="team-card-desc">Specializes in cross-platform mobile architecture, high-performance Flutter applications, and seamless API integrations.</p>'
)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(txt)

print("Updated about.html with Sanjay Vaja successfully")

