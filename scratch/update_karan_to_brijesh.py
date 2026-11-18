with open('about.html', 'r', encoding='utf-8') as f:
    txt = f.read()

txt = txt.replace('alt="Karan Patel - Full Stack Developer"', 'alt="Brijesh Lathiya - Full Stack Developer"')
txt = txt.replace('src="assets/team-karan.jpg"', 'src="assets/team-brijesh.jpg"')
txt = txt.replace('<h3 class="team-card-name">Karan Patel</h3>', '<h3 class="team-card-name">Brijesh Lathiya</h3>')

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(txt)

print("Updated about.html with Brijesh Lathiya successfully")

