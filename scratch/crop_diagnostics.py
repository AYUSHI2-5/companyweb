from PIL import Image

# Let's crop and inspect specific sections from the full page
im = Image.open('scratch/project_full_page.png')
print('Full page dimensions:', im.size)

# Let's save smaller diagnostic crops of:
# 1. Hero & Spec grid (Y: 0 to 1200)
c1 = im.crop((0, 0, 1440, 1200))
c1.save('scratch/diag_01_hero.png')

# 2. Stage image & Story (Y: 1200 to 2400)
c2 = im.crop((0, 1200, 1440, 2400))
c2.save('scratch/diag_02_stage_story.png')

# 3. Features & Tech (Y: 2400 to 3800)
c3 = im.crop((0, 2400, 1440, 3800))
c3.save('scratch/diag_03_features_tech.png')

# 4. Architecture (Y: 3800 to 5200)
c4 = im.crop((0, 3800, 1440, 5200))
c4.save('scratch/diag_04_arch.png')

# 5. Showcase & Contributions (Y: 5200 to 6800)
c5 = im.crop((0, 5200, 1440, 6800))
c5.save('scratch/diag_05_showcase_contrib.png')

# 6. Results & Links & Related (Y: 6800 to 8600)
c6 = im.crop((0, 6800, 1440, 8600))
c6.save('scratch/diag_06_results_links.png')

print("Cropped diagnostic images successfully!")

