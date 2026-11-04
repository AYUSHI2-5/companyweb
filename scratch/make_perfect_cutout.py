from PIL import Image
import numpy as np
import cv2

img = Image.open('assets/teacher-pointing-avatar.png')
w, h = img.size
arr = np.array(img)
rgb = arr[:, :, :3]
alpha = arr[:, :, 3].copy()

# On the right side (x > 250):
# Only arm, hand, and stylus are foreground!
for y in range(h):
    for x in range(250, w):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        is_sweater = (r > 80 and r > g + 25 and r > b + 25)
        is_skin = (r > 140 and g > 85 and b > 55 and r >= g and g >= b)
        is_stylus = (r < 70 and g < 70 and b < 70)
        is_tablet = (r < 95 and g < 95 and b < 95 and x < 325 and y > 430)
        is_collar = (r > 180 and g > 180 and b > 180 and x < 265 and y < 250)
        
        if not (is_sweater or is_skin or is_stylus or is_tablet or is_collar):
            alpha[y, x] = 0

# Also clean any stray on top / left of head:
for y in range(0, 150):
    for x in range(0, 80):
        alpha[y, x] = 0

alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)
arr[:, :, 3] = alpha_smooth

cleaned = Image.fromarray(arr)
cleaned.save('assets/teacher-pointing-avatar.png')
print("Pixel-perfect cutout complete!")

