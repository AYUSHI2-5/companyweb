import cv2
import numpy as np
from PIL import Image

img = Image.open('scratch/pointing_cutout_v2.png')
w, h = img.size
data = np.array(img)
alpha = data[:, :, 3].copy()
rgb = data[:, :, :3]

# 1. Clean the gap between her neck/shoulder and raised right arm:
# Neck & glasses: x < 285
# Raised arm & sleeve: x > 370 at y: 200..400, x > 340 at y: 400..500
# Tablet edge: x between 290 and 315 at y: 470..550
# In the rectangle x: 285 to 370, y: 160 to 440:
# The background has high brightness (r > 200 and g > 200) or faint pink line
for y in range(160, 460):
    for x in range(285, 375):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        # If it's not the dark tablet or red sweater:
        # Red sweater has R > 120 and G < 60 and B < 60
        # Dark tablet has R < 80, G < 80, B < 80
        is_sweater = (r > 100 and g < 60 and b < 60)
        is_tablet = (r < 90 and g < 90 and b < 90)
        is_skin = (r > 180 and g > 130 and b > 100 and r > g > b)
        if not (is_sweater or is_tablet or (is_skin and x < 290)):
            alpha[y, x] = 0

# 2. Clean right side outside the arm (x > 410, y: 220 to 550)
for y in range(220, 560):
    for x in range(410, w):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        is_sweater = (r > 100 and g < 60 and b < 60)
        is_skin = (r > 180 and g > 130 and b > 100)
        is_stylus = (r < 70 and g < 70 and b < 70)
        if not (is_sweater or is_skin or is_stylus):
            alpha[y, x] = 0

# 3. Clean bottom left yellow corner (x < 90, y > 570)
for y in range(570, h):
    for x in range(0, 95):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        is_sweater = (r > 100 and g < 60 and b < 60)
        if not is_sweater:
            alpha[y, x] = 0

# 4. Clean bottom edge: crop at y = 585 where sweater ribbing ends cleanly
# Smooth alpha slightly
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)
data[:, :, 3] = alpha_smooth

cleaned = Image.fromarray(data).crop((0, 0, w, 585))
cleaned.save('assets/teacher-pointing-avatar.png')
print("Saved clean pointing avatar to assets/teacher-pointing-avatar.png:", cleaned.size)

