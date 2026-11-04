import cv2
import numpy as np
from PIL import Image

img_bgr = cv2.imread('scratch/pointing_exact_crop.png')
h, w = img_bgr.shape[:2]

flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)

# Seeds covering white background, gap, and the faint lines
seeds = [
    (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
    (320, 200), (450, 280), (320, 245), (450, 245),
    (320, 505), (450, 505), (280, 245), (360, 245)
]

diff = (45, 45, 45)
flood_img = img_bgr.copy()
for seed in seeds:
    cv2.floodFill(flood_img, flood_mask, seed, (0, 255, 0), diff, diff, cv2.FLOODFILL_FIXED_RANGE)

# Never allow flood fill to eat into the red sweater or hair or hand:
# Red sweater: R > 100, G < 60, B < 60
r = img_bgr[:, :, 2].astype(int)
g = img_bgr[:, :, 1].astype(int)
b = img_bgr[:, :, 0].astype(int)
is_red = (r > 80) & (r > g + 25) & (r > b + 25)
is_dark = (r < 75) & (g < 75) & (b < 75) # hair/tablet/stylus
is_skin = (r > 140) & (g > 85) & (b > 55) & (r > g) & (g > b)

bg_region = (flood_mask[1:-1, 1:-1] == 1) & (~is_red) & (~is_dark) & (~is_skin)

alpha = np.ones((h, w), dtype=np.uint8) * 255
alpha[bg_region] = 0

# Crop bottom cleanly at y = 575
alpha = alpha[:575, :]
img_bgr = img_bgr[:575, :, :]

alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)

b_ch, g_ch, r_ch = cv2.split(img_bgr)
rgba = cv2.merge([r_ch, g_ch, b_ch, alpha_smooth])

final_img = Image.fromarray(rgba)
final_img.save('assets/teacher-pointing-avatar.png')
print("Flawless cutout saved to assets/teacher-pointing-avatar.png!")

