from PIL import Image

img = Image.open('assets/teacher-avatar-user.png')
# Wrist and sleeve crop
wrist_crop = img.crop((80, 220, 240, 390))
wrist_crop.save('scratch/wrist_zoom.png')
print("Saved scratch/wrist_zoom.png")

