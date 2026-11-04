from PIL import Image

img = Image.open(r'C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/.user_uploaded/media_1793609174693_af451703.jpg')
w, h = img.size

# Let's crop x: 20 to 520, y: 350 to 969
# Stylus reaches into x ~ 500, y ~ 500
# Hair bun top is around y ~ 370
crop = img.crop((30, 360, 520, 969))
crop.save('scratch/pointing_avatar_crop.png')
print("Saved scratch/pointing_avatar_crop.png")

