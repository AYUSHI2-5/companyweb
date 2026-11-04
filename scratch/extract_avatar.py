import cv2
import numpy as np
from PIL import Image

# Read image
img_bgr = cv2.imread('scratch/user_avatar_crop.png')
h, w = img_bgr.shape[:2]

# Initial mask for GrabCut:
# 0: BGD, 1: FGD, 2: PR_BGD, 3: PR_FGD
mask = np.zeros((h, w), np.uint8)

# Bounding box of character
rect = (10, 10, w - 20, h - 15)

# Background color cues:
# Anything very bright / grayish white is likely background
gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
is_bg_light = gray > 235

# But the white shirt and collar inside should be preserved!
# So only mark as definite background if connected to outside border
bg_mask = np.zeros((h, w), dtype=np.uint8)
bg_mask[is_bg_light] = 255

# Flood fill from top-left, top-right, bottom-right corners
cv2.floodFill(bg_mask, None, (0, 0), 128)
cv2.floodFill(bg_mask, None, (w - 1, 0), 128)
cv2.floodFill(bg_mask, None, (w - 1, int(h * 0.7)), 128)
cv2.floodFill(bg_mask, None, (0, int(h * 0.7)), 128)

exterior_bg = (bg_mask == 128)

mask[:] = cv2.GC_PR_FGD
mask[exterior_bg] = cv2.GC_BGD

# Foreground cues:
# Red sweater
hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
red_mask1 = cv2.inRange(hsv, (0, 70, 50), (10, 255, 255))
red_mask2 = cv2.inRange(hsv, (170, 70, 50), (180, 255, 255))
is_red = (red_mask1 > 0) | (red_mask2 > 0)
mask[is_red & ~exterior_bg] = cv2.GC_FGD

# Hair / face center
mask[int(h*0.1):int(h*0.3), int(w*0.35):int(w*0.65)] = cv2.GC_FGD

# Run GrabCut
bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)
cv2.grabCut(img_bgr, mask, rect, bgdModel, fgdModel, 6, cv2.GC_INIT_WITH_MASK)

# Final mask
mask2 = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype('uint8')

# Clean up mask with morphological closing
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel, iterations=2)

# Smooth edges with Gaussian Blur
alpha_smooth = cv2.GaussianBlur(mask2, (5, 5), 0)

# Merge RGBA
b, g, r = cv2.split(img_bgr)
rgba = cv2.merge([r, g, b, alpha_smooth])

cv2.imwrite('scratch/user_avatar_cutout.png', cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
print("Saved scratch/user_avatar_cutout.png")

