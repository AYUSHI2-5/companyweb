import cv2
import numpy as np
from PIL import Image

# Re-read scratch/test_cutout_v2.png
img = Image.open('scratch/test_cutout_v2.png')
w, h = img.size
data = np.array(img)

rgb = data[:, :, :3]
alpha = data[:, :, 3].copy()

# Look at y < 100, x > 260
# Background has high brightness (r > 210, g > 210, b > 210)
# Hair has dark color (r < 90, g < 80, b < 80)
for y in range(0, 110):
    for x in range(250, w):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        # If it's near-white background or the text pill
        if r > 180 and g > 180 and b > 180:
            alpha[y, x] = 0
        # If it's the green dot or text
        elif abs(r - g) > 30 and g > r: # green
            alpha[y, x] = 0
        elif (r > 100 or g > 100 or b > 100) and not (r < 70 and g < 60 and b < 60):
            # grey text
            if y < 85:
                alpha[y, x] = 0

# Clean right side line around y: 320-390, x > 380
for y in range(300, 420):
    for x in range(370, w):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        # The line is light grey/pinkish: r > 180, g > 170, b > 170
        if r > 160 and g > 150:
            alpha[y, x] = 0

# Smooth alpha slightly
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)
data[:, :, 3] = alpha_smooth

final_img = Image.fromarray(data)
final_img.save('assets/teacher-avatar-user.png')
print("Saved restored hair bun to assets/teacher-avatar-user.png")

