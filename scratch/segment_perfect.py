import cv2
import numpy as np
from PIL import Image

# Read original exact crop
img_orig = Image.open('scratch/pointing_exact_crop.png').convert('RGB')
w, h = img_orig.size
arr = np.array(img_orig)

# Let's define foreground conditions:
r = arr[:, :, 0].astype(int)
g = arr[:, :, 1].astype(int)
b = arr[:, :, 2].astype(int)

# 1. Hair: dark (r < 90, g < 80, b < 80)
is_hair = (r < 95) & (g < 85) & (b < 85)

# 2. Red sweater: rich red (r > 90 and r > g + 40 and r > b + 40)
is_sweater = (r > 80) & (r > g + 30) & (r > b + 30)

# 3. Red glasses: bright red
is_glasses = (r > 140) & (g < 60) & (b < 60)

# 4. Skin (neck, ear, hand): warm tone (r > 150, g > 100, b > 70, r > g > b)
is_skin = (r > 150) & (g > 95) & (b > 65) & (r >= g) & (g >= b) & (r - b > 35)

# 5. Collar: white collar at y: 350 to 420, x: 90 to 250
is_collar = (r > 180) & (g > 180) & (b > 180)
collar_box = np.zeros((h, w), dtype=bool)
collar_box[340:425, 90:255] = True
is_collar_final = is_collar & collar_box

# 6. Tablet: dark slate (r < 90, g < 95, b < 100) at y: 440 to 560, x: 280 to 330
tablet_box = np.zeros((h, w), dtype=bool)
tablet_box[440:560, 275:335] = True
is_tablet = (r < 100) & (g < 105) & (b < 110) & tablet_box

# 7. Stylus: dark cylinder extending from hand to tip (x: 420 to 470, y: 120 to 230)
stylus_box = np.zeros((h, w), dtype=bool)
stylus_box[115:230, 420:470] = True
is_stylus = (r < 80) & (g < 80) & (b < 80) & stylus_box

# Combined foreground
is_fg = is_hair | is_sweater | is_glasses | is_skin | is_collar_final | is_tablet | is_stylus

# Crop out any bottom stray below y = 575
is_fg[575:, :] = False

# Clean up with morphological closing (to fill sweater texture pores)
fg_mask = (is_fg.astype(np.uint8)) * 255
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel, iterations=3)

# Smooth edges
alpha_smooth = cv2.GaussianBlur(fg_mask, (3, 3), 0)

# Build final RGBA
rgba = np.zeros((h, w, 4), dtype=np.uint8)
rgba[:, :, :3] = arr
rgba[:, :, 3] = alpha_smooth

final_avatar = Image.fromarray(rgba).crop((0, 0, w, 575))
final_avatar.save('assets/teacher-pointing-avatar.png')
print("Successfully generated assets/teacher-pointing-avatar.png:", final_avatar.size)

