import cv2
import numpy as np
from PIL import Image

# Read original exact crop (470 x 615)
img_bgr = cv2.imread('scratch/pointing_exact_crop.png')
h, w = img_bgr.shape[:2]

# Let's inspect where the character is:
# We know the character's bounding box:
# Hair bun top: y=9
# Sweater bottom: y=575
# Left edge: x=10
# Right edge (stylus tip): x=457, y=125

# Let's use GrabCut with a well-defined rectangle
# Everything outside the character's rough silhouette is BGD
mask = np.zeros((h, w), np.uint8)
mask[:] = cv2.GC_PR_BGD

# Definite foreground:
# Head/hair:
cv2.circle(mask, (180, 120), 80, cv2.GC_FGD, -1)
# Upper back/sweater:
cv2.ellipse(mask, (190, 350), (100, 80), 0, 0, 360, cv2.GC_FGD, -1)
# Lower back/sweater:
cv2.ellipse(mask, (180, 480), (100, 70), 0, 0, 360, cv2.GC_FGD, -1)
# Right arm:
cv2.line(mask, (260, 420), (370, 360), cv2.GC_FGD, 50)
cv2.line(mask, (370, 360), (410, 240), cv2.GC_FGD, 40)
# Right hand & stylus:
cv2.line(mask, (410, 240), (455, 130), cv2.GC_FGD, 18)

# Definite background:
# 4 corners
cv2.rectangle(mask, (0, 0), (70, 70), cv2.GC_BGD, -1)
cv2.rectangle(mask, (w - 70, 0), (w, 100), cv2.GC_BGD, -1)
cv2.rectangle(mask, (0, h - 50), (40, h), cv2.GC_BGD, -1)
cv2.rectangle(mask, (w - 50, h - 80), (w, h), cv2.GC_BGD, -1)
# Area above arm / right of head (x: 270 to 410, y: 0 to 180):
cv2.rectangle(mask, (270, 0), (420, 180), cv2.GC_BGD, -1)
# Far right air (x > 465):
cv2.rectangle(mask, (465, 0), (w, h), cv2.GC_BGD, -1)
# The gap between head/back and arm:
# Neck is at x ~ 230, arm is at x ~ 370
cv2.circle(mask, (310, 320), 25, cv2.GC_BGD, -1)
cv2.circle(mask, (325, 370), 20, cv2.GC_BGD, -1)
# Air to the right of the arm (x > 430, y > 260):
cv2.rectangle(mask, (430, 260), (w, 530), cv2.GC_BGD, -1)

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)
rect = (5, 5, w - 10, h - 10)

cv2.grabCut(img_bgr, mask, rect, bgdModel, fgdModel, 6, cv2.GC_INIT_WITH_MASK)

# Extract mask
fg_mask = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype('uint8')

# Ensure stylus tip is retained
cv2.line(fg_mask, (410, 240), (455, 130), 255, 8)

# Clean mask
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
alpha = cv2.GaussianBlur(fg_mask, (3, 3), 0)

b, g, r = cv2.split(img_bgr)
rgba = cv2.merge([r, g, b, alpha])
final_img = Image.fromarray(rgba).crop((0, 0, w, 575))
final_img.save('assets/teacher-pointing-avatar.png')
print("Saved clean grabcut to assets/teacher-pointing-avatar.png")

