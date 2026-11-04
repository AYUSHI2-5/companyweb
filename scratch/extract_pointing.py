import cv2
import numpy as np
from PIL import Image

img_bgr = cv2.imread('scratch/pointing_avatar_crop.png')
h, w = img_bgr.shape[:2]

# Build trimap for GrabCut:
# 0 = BGD, 1 = FGD, 2 = PR_BGD, 3 = PR_FGD
trimap = np.full((h, w), cv2.GC_PR_FGD, dtype=np.uint8)

# Definite Background:
trimap[0:15, :] = cv2.GC_BGD
trimap[:, 0:15] = cv2.GC_BGD
trimap[:, w-15:] = cv2.GC_BGD
# Top-left corner outside hair
trimap[0:90, 0:70] = cv2.GC_BGD
# Top-right corner outside arm
trimap[0:150, 480:] = cv2.GC_BGD
# Area above arm & right of head:
# Head right edge is x ~ 280 (glasses at x ~ 290)
# Arm starts at shoulder (x ~ 260, y ~ 400) and extends to hand (x ~ 420, y ~ 250) and stylus (x ~ 475, y ~ 185)
# So area above x: 300 to 450, y: 0 to 160 is background
trimap[0:160, 300:460] = cv2.GC_BGD
# Area below arm on the right (x > 450, y > 270)
trimap[270:500, 440:] = cv2.GC_BGD

# Definite Foreground:
# Hair bun core:
trimap[50:180, 140:240] = cv2.GC_FGD
# Back / sweater core:
trimap[380:550, 100:320] = cv2.GC_FGD
# Arm sleeve:
trimap[440:550, 320:410] = cv2.GC_FGD
# Hand:
trimap[240:290, 390:440] = cv2.GC_FGD
# Stylus:
trimap[190:240, 420:460] = cv2.GC_FGD

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)
rect = (10, 10, w - 20, h - 20)

cv2.grabCut(img_bgr, trimap, rect, bgdModel, fgdModel, 8, cv2.GC_INIT_WITH_MASK)

mask = np.where((trimap == cv2.GC_FGD) | (trimap == cv2.GC_PR_FGD), 255, 0).astype('uint8')

# Clean mask
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
alpha = cv2.GaussianBlur(mask, (3, 3), 0)

b, g, r = cv2.split(img_bgr)
rgba = cv2.merge([r, g, b, alpha])
Image.fromarray(rgba).save('scratch/pointing_cutout_v1.png')
print("Saved scratch/pointing_cutout_v1.png")

