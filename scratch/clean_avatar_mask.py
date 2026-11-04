import cv2
import numpy as np
from PIL import Image

img = Image.open('scratch/test_cutout_v2.png')
w, h = img.size
data = np.array(img)

alpha = data[:, :, 3]

# 1. Clean above bun / top right (y < 95, x > 280)
alpha[:95, 280:] = 0

# 2. Clean right edge outside her sleeve (x > 385, y < 380)
# Let's inspect x > 385, y between 330 and 380:
# The sleeve ends at x ~ 385 around y=360
# Let's zero out pixels in that box that are light grey / line
for y in range(320, 390):
    for x in range(385, w):
        # The line is light grey/pinkish, not the dark red of sleeve
        r, g, b = data[y, x, 0], data[y, x, 1], data[y, x, 2]
        # Red sweater has R > 120 and G < 60 and B < 60
        if not (r > 100 and g < 60 and b < 60):
            alpha[y, x] = 0

# Clean far right (x > 470, y < 450)
alpha[:450, 465:] = 0

# Clean far left (x < 60, y < 300)
alpha[:300, :60] = 0

data[:, :, 3] = alpha
cleaned = Image.fromarray(data)
cleaned.save('assets/teacher-avatar-user.png')
print("Saved cleaned avatar to assets/teacher-avatar-user.png")

