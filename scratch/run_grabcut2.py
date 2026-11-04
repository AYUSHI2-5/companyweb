import cv2
import numpy as np
from PIL import Image

# Load image
img = cv2.imread('scratch/user_avatar_crop.png')
h, w = img.shape[:2]

# Let's inspect the boundaries of the character:
# Top bun: y ~ 35 to 220, x ~ 150 to 350
# Left edge of sweater: x ~ 40 to 50
# Right edge of sweater/tablet: x ~ 470 to 480
# Bottom edge: y ~ 625

# Let's create an exterior background mask
# Notice: Background at top-left has pill at y: 0 to 110, x: 0 to 450
# Background at top-right has white background
# Background at left: x < 50
# Background at right: x > 475

# Let's build a clean trimap for GrabCut:
# 0 = cv2.GC_BGD (definite background)
# 1 = cv2.GC_FGD (definite foreground)
# 2 = cv2.GC_PR_BGD (probable background)
# 3 = cv2.GC_PR_FGD (probable foreground)
trimap = np.full((h, w), cv2.GC_PR_FGD, dtype=np.uint8)

# Definite background:
# Far corners and edges
trimap[0:40, :] = cv2.GC_BGD
trimap[:, 0:25] = cv2.GC_BGD
trimap[:, 480:] = cv2.GC_BGD
# Pill text at top-left outside hair
trimap[0:120, 0:130] = cv2.GC_BGD
trimap[0:100, 360:] = cv2.GC_BGD
# Background white on sides
trimap[120:300, 0:120] = cv2.GC_BGD
trimap[120:300, 360:] = cv2.GC_BGD
# Google Ads pill area on the right outside tablet
trimap[430:600, 460:] = cv2.GC_BGD

# Definite foreground:
# Head / face / eyes
trimap[120:250, 180:330] = cv2.GC_FGD
# Sweater core / chest
trimap[320:580, 100:440] = cv2.GC_FGD
# Stylus and right hand
trimap[220:320, 140:220] = cv2.GC_FGD

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

rect = (20, 20, w - 40, h - 30)
cv2.grabCut(img, trimap, rect, bgdModel, fgdModel, 8, cv2.GC_INIT_WITH_MASK)

mask = np.where((trimap == cv2.GC_FGD) | (trimap == cv2.GC_PR_FGD), 255, 0).astype('uint8')

# Morphological smooth
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
alpha = cv2.GaussianBlur(mask, (3, 3), 0)

b, g, r = cv2.split(img)
rgba = cv2.merge([r, g, b, alpha])
Image.fromarray(rgba).save('scratch/test_cutout_v2.png')
print("Saved scratch/test_cutout_v2.png")

