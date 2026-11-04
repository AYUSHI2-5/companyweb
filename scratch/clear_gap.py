from PIL import Image
import numpy as np
import cv2

img = Image.open('assets/teacher-pointing-avatar.png')
w, h = img.size
arr = np.array(img)
rgb = arr[:, :, :3]
alpha = arr[:, :, 3]

# In the gap: y from 210 to 480, x from 240 to 390:
for y in range(210, 480):
    for x in range(240, 390):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        # Is it the red sweater? (r > 90 and g < 65 and b < 65)
        is_sweater = (r > 90 and g < 65 and b < 65)
        # Is it neck skin? (r > 150 and g > 100 and b > 70 and x < 265 and y < 270)
        is_skin = (r > 150 and g > 100 and b > 70 and x < 265 and y < 270)
        # Is it dark tablet? (r < 80 and g < 80 and b < 80 and x > 280 and y > 430)
        is_tablet = (r < 80 and g < 80 and b < 80 and x > 280 and y > 430)
        # Is it white collar? (r > 180 and g > 180 and b > 180 and x < 250 and y < 250)
        is_collar = (r > 180 and g > 180 and b > 180 and x < 250 and y < 250)
        
        if not (is_sweater or is_skin or is_tablet or is_collar):
            alpha[y, x] = 0

# Also check around the stylus: y from 110 to 220, x from 400 to 470
for y in range(110, 220):
    for x in range(390, 470):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        is_stylus = (r < 65 and g < 65 and b < 65)
        is_hand = (r > 150 and g > 100 and b > 70)
        if not (is_stylus or is_hand):
            alpha[y, x] = 0

# Smooth alpha
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)
arr[:, :, 3] = alpha_smooth

cleaned = Image.fromarray(arr)
cleaned.save('assets/teacher-pointing-avatar.png')
print("Successfully cleared gap!")

