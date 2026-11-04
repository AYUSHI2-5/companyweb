import cv2
import numpy as np
from PIL import Image

# Read original
orig = Image.open('scratch/pointing_exact_crop.png').convert('RGBA')
arr_orig = np.array(orig)
# Read current mask
curr = Image.open('assets/teacher-pointing-avatar.png')
arr_curr = np.array(curr)

alpha = arr_curr[:, :, 3].copy()

# 1. Restore her neck and jawline (y: 190..350, x: 210..275) from orig where skin is
# Skin tone: r > 160, g > 100, b > 70
r = arr_orig[:350, 200:280, 0].astype(int)
g = arr_orig[:350, 200:280, 1].astype(int)
b = arr_orig[:350, 200:280, 2].astype(int)
is_skin = (r > 150) & (g > 95) & (b > 65) & (r >= g) & (g >= b)
alpha[:350, 200:280][is_skin] = 255

# 2. Clear under the wrist gap: y: 220 to 310, x: 320 to 375
# White background in gap: r > 210, g > 210, b > 210
gap_r = arr_orig[210:320, 320:385, 0].astype(int)
gap_g = arr_orig[210:320, 320:385, 1].astype(int)
gap_b = arr_orig[210:320, 320:385, 2].astype(int)
is_gap_bg = (gap_r > 195) & (gap_g > 195) & (gap_b > 195)
alpha[210:320, 320:385][is_gap_bg] = 0

# 3. Clear between neck and wrist: y: 180 to 240, x: 265 to 385
for y in range(180, 240):
    for x in range(265, 385):
        pr, pg, pb = int(arr_orig[y, x, 0]), int(arr_orig[y, x, 1]), int(arr_orig[y, x, 2])
        if pr > 190 and pg > 190 and pb > 190:
            alpha[y, x] = 0

# Smooth alpha
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)
arr_curr[:, :, 3] = alpha_smooth
arr_curr[:, :, :3] = arr_orig[:575, :, :3]

cleaned = Image.fromarray(arr_curr)
cleaned.save('assets/teacher-pointing-avatar.png')
print("Pristine final pointing avatar saved!")

