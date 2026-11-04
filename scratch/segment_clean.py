import cv2
import numpy as np
from PIL import Image

img_orig = Image.open('scratch/pointing_exact_crop.png').convert('RGB')
w, h = img_orig.size
arr = np.array(img_orig)

r = arr[:, :, 0].astype(int)
g = arr[:, :, 1].astype(int)
b = arr[:, :, 2].astype(int)

# 1. Hair: dark (r < 95, g < 85, b < 85) in head region (y < 350, x < 320)
head_box = np.zeros((h, w), dtype=bool)
head_box[:350, :320] = True
is_hair = (r < 95) & (g < 85) & (b < 85) & head_box

# 2. Red glasses:
glasses_box = np.zeros((h, w), dtype=bool)
glasses_box[120:220, 240:320] = True
is_glasses = (r > 140) & (g < 70) & (b < 70) & glasses_box

# 3. Skin: strictly neck/ear OR hand
# Neck/ear: y: 160 to 360, x: 200 to 290
neck_box = np.zeros((h, w), dtype=bool)
neck_box[160:360, 200:290] = True
# Hand: y: 220 to 320, x: 385 to 450
hand_box = np.zeros((h, w), dtype=bool)
hand_box[220:320, 385:450] = True

is_skin_color = (r > 150) & (g > 95) & (b > 65) & (r >= g) & (g >= b) & (r - b > 30)
is_skin = is_skin_color & (neck_box | hand_box)

# 4. White collar: y: 340 to 425, x: 90 to 255
collar_box = np.zeros((h, w), dtype=bool)
collar_box[340:425, 90:255] = True
is_collar = (r > 180) & (g > 180) & (b > 180) & collar_box

# 5. Red sweater:
# Torso: y: 360 to 575, x: 50 to 330
torso_box = np.zeros((h, w), dtype=bool)
torso_box[360:575, 50:330] = True
# Arm: y: 350 to 560, x: 320 to 440
arm_box = np.zeros((h, w), dtype=bool)
arm_box[350:560, 320:440] = True

is_sweater_color = (r > 80) & (r > g + 30) & (r > b + 30)
is_sweater = is_sweater_color & (torso_box | arm_box)

# 6. Tablet: y: 440 to 560, x: 275 to 335
tablet_box = np.zeros((h, w), dtype=bool)
tablet_box[440:560, 275:335] = True
is_tablet = (r < 100) & (g < 105) & (b < 110) & tablet_box

# 7. Stylus: y: 115 to 230, x: 420 to 475
stylus_box = np.zeros((h, w), dtype=bool)
stylus_box[115:230, 420:475] = True
is_stylus = (r < 80) & (g < 80) & (b < 80) & stylus_box

# Combined Foreground
is_fg = is_hair | is_glasses | is_skin | is_collar | is_sweater | is_tablet | is_stylus

# Fill knit holes
fg_mask = (is_fg.astype(np.uint8)) * 255
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel, iterations=3)

# Smooth edges
alpha_smooth = cv2.GaussianBlur(fg_mask, (3, 3), 0)

rgba = np.zeros((h, w, 4), dtype=np.uint8)
rgba[:, :, :3] = arr
rgba[:, :, 3] = alpha_smooth

final_avatar = Image.fromarray(rgba).crop((0, 0, w, 575))
final_avatar.save('assets/teacher-pointing-avatar.png')
print("Pristine avatar saved to assets/teacher-pointing-avatar.png:", final_avatar.size)

