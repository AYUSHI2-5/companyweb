with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('<div class="portfolio-grid">')
pos2 = text.find('</main>')
print(text[pos1:pos1+200])
print("...")
# find closing div for portfolio-grid
pos_grid_end = text.find('</div>\n      </div>\n    </section>', pos1)
print("pos_grid_end snippet:")
print(text[pos_grid_end-100:pos_grid_end+100])

