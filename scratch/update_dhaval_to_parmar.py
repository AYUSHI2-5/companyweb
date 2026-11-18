with open('about.html', 'r', encoding='utf-8') as f:
    txt = f.read()

txt = txt.replace('alt="Dhaval Shah - Founder & CEO"', 'alt="M K Parmar - Founder & CEO"')
txt = txt.replace('src="assets/team-dhaval.jpg"', 'src="assets/team-mk-parmar.jpg"')
txt = txt.replace('<h3 class="team-card-name">Dhaval Shah</h3>', '<h3 class="team-card-name">M K Parmar</h3>')

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(txt)

print("Updated about.html with M K Parmar successfully")

