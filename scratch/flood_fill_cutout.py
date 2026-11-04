import cv2
import numpy as np
from PIL import Image

# Read original
img_bgr = cv2.imread('scratch/pointing_exact_crop.png')
h, w = img_bgr.shape[:2]

# Let's inspect the background color at (10, 10):
bg_color = img_bgr[10, 10].tolist()
print("Background sample at (10, 10):", bg_color)

# Create mask for floodFill: size (h+2, w+2)
flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)

# Flood fill from:
# 1. Top left (0, 0)
# 2. Top right (w-1, 0)
# 3. In the gap between hair and arm: (310, 200)
# 4. Under arm on right: (440, 300)
# 5. Bottom left below waist: (10, h-1)
seeds = [(0, 0), (w - 1, 0), (320, 220), (450, 280), (0, h - 1), (w - 1, h - 1)]

# Tolerance for background:
# Since background is white/light-gray (240-255) and lines are (180-255),
# tolerance of 35-45 from seed
diff = (35, 35, 35)

flood_img = img_bgr.copy()
for seed in seeds:
    cv2.floodFill(flood_img, flood_mask, seed, (0, 255, 0), diff, diff, cv2.FLOODFILL_FIXED_RANGE)

# The flood filled region in flood_mask (where flood_mask == 1) is the background!
bg_region = (flood_mask[1:-1, 1:-1] == 1)

# Alpha channel
alpha = np.ones((h, w), dtype=np.uint8) * 255
alpha[bg_region] = 0

# Clean edges
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)

b, g, r = cv2.split(img_bgr)
rgba = cv2.merge([r, g, b, alpha_smooth])

final_img = Image.fromarray(rgba).crop((0, 0, w, 575))
final_img.save('assets/teacher-pointing-avatar.png')
print("Flood fill cutout saved to assets/teacher-pointing-avatar.png:", final_img.size)

