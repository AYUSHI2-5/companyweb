from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/.user_uploaded/media_1793604088763_14283fa4.jpg')
arr = np.array(img)

# Let's crop x: 80 to 570, y: 240 to 880
crop1 = img.crop((80, 240, 580, 880))
crop1.save('scratch/user_avatar_crop.png')
print("Cropped user avatar to scratch/user_avatar_crop.png")

