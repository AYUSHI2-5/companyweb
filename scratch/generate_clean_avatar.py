import cv2
import numpy as np
from PIL import Image

orig = Image.open('scratch/pointing_exact_crop.png').convert('RGB')
w, h = orig.size
arr = np.array(orig)

r = arr[:, :, 0].astype(int)
g = arr[:, :, 1].astype(int)
b = arr[:, :, 2].astype(int)

# Default: all pixels are foreground
alpha = np.ones((h, w), dtype=np.uint8) * 255

# Skin boxes where skin exists:
# Neck / ear / jaw: x: 190 to 290, y: 150 to 360
# Hand: x: 380 to 455, y: 200 to 340
is_skin_box = np.zeros((h, w), dtype=bool)
is_skin_box[150:360, 190:290] = True
is_skin_box[200:340, 380:455] = True
is_real_skin = is_skin_box & (r > 150) & (g > 90) & (b > 60) & (r > g) & (g > b)

# Collar box where white shirt collar exists:
# x: 90 to 255, y: 345 to 430
is_collar_box = np.zeros((h, w), dtype=bool)
is_collar_box[345:430, 90:255] = True
is_real_collar = is_collar_box & (r > 160) & (g > 160) & (b > 160)

# Outside of real skin and real collar:
# Any pixel that is bright/light (g > 85 or b > 85) is BACKGROUND!
is_background_light = (g > 85) | (b > 85)
is_bg = is_background_light & (~is_real_skin) & (~is_real_collar)

alpha[is_bg] = 0

# Crop bottom cleanly at y = 575
alpha = alpha[:575, :]
arr = arr[:575, :, :]

# Smooth alpha edges
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)

rgba = np.zeros((575, w, 4), dtype=np.uint8)
rgba[:, :, :3] = arr
rgba[:, :, 3] = alpha_smooth

final_img = Image.fromarray(rgba)
final_img.save('assets/teacher-pointing-avatar.png')
print("Saved final pointing avatar:", final_img.size)

