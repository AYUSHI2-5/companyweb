with open('about.html', 'r', encoding='utf-8') as f:
    txt = f.read()

txt = txt.replace('alt="Riya Mehta - Product Design Lead"', 'alt="Ishani Parikh - UI/UX Designer"')
txt = txt.replace('src="assets/team-riya.jpg"', 'src="assets/team-ishani.jpg"')
txt = txt.replace('<h3 class="team-card-name">Riya Mehta</h3>', '<h3 class="team-card-name">Ishani Parikh</h3>')

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(txt)

print("Updated about.html with Ishani Parikh successfully")

