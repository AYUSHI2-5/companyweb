from PIL import Image
import numpy as np

img = Image.open('scratch/pointing_avatar_crop.png')
# Hand & stylus box: x from 380 to 490, y from 160 to 320
hand_crop = img.crop((380, 160, 490, 320))
hand_crop.save('scratch/pointing_hand_zoom.png')
print("Saved scratch/pointing_hand_zoom.png")

