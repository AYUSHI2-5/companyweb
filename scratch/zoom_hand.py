from PIL import Image

img = Image.open('assets/teacher-avatar-user.png')
# Hand region: x from 100 to 230, y from 160 to 330
hand_crop = img.crop((100, 160, 230, 330))
hand_crop.save('scratch/hand_zoom.png')
print("Saved scratch/hand_zoom.png")

