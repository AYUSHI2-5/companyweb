from PIL import Image
import numpy as np
import cv2

orig = Image.open('scratch/pointing_exact_crop.png').convert('RGB').crop((0, 0, 470, 575))
arr_orig = np.array(orig)
w, h = orig.size

curr = Image.open('assets/teacher-pointing-avatar.png')
alpha = np.array(curr)[:, :, 3].copy()

r = arr_orig[:, :, 0].astype(int)
g = arr_orig[:, :, 1].astype(int)
b = arr_orig[:, :, 2].astype(int)

# Sleeve: x: 330 to 445, y: 330 to 570
sleeve_box = np.zeros((h, w), dtype=bool)
sleeve_box[330:570, 330:445] = True
is_sleeve = (r > 70) & (r > g + 20) & (r > b + 20) & sleeve_box
alpha[is_sleeve] = 255

# Hand & wrist (x: 375 to 445, y: 220 to 330)
hand_box = np.zeros((h, w), dtype=bool)
hand_box[220:330, 375:445] = True
is_hand = (r > 140) & (g > 85) & (b > 55) & hand_box
alpha[is_hand] = 255

# Stylus (x: 420 to 465, y: 120 to 230)
stylus_box = np.zeros((h, w), dtype=bool)
stylus_box[120:230, 420:465] = True
is_stylus = (r < 70) & (g < 70) & (b < 70) & stylus_box
alpha[is_stylus] = 255

# Torso (x: 50 to 330, y: 350 to 575)
torso_box = np.zeros((h, w), dtype=bool)
torso_box[350:575, 50:330] = True
is_torso = (r > 70) & (r > g + 20) & (r > b + 20) & torso_box
alpha[is_torso] = 255

final_arr = np.zeros((h, w, 4), dtype=np.uint8)
final_arr[:, :, :3] = arr_orig
final_arr[:, :, 3] = cv2.GaussianBlur(alpha, (3, 3), 0)

final_img = Image.fromarray(final_arr)
final_img.save('assets/teacher-pointing-avatar.png')
print("Successfully restored solid sleeve and avatar:", final_img.size)
