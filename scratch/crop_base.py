from PIL import Image

img = Image.open('assets/teacher-avatar.png')
w, h = img.size
# Crop off the faint shadow below her resting forearms for a clean flat base
cropped = img.crop((0, 0, w, 1135))
cropped.save('assets/teacher-avatar.png', 'PNG')
print(f"Cropped to clean base: {cropped.size}")

