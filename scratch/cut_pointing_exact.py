import cv2
import numpy as np
from PIL import Image

full_img = Image.open(r'C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/.user_uploaded/media_1793609174693_af451703.jpg')
# Crop exact bounding box: x: 45 to 515, y: 350 to 965
cropped = full_img.crop((45, 350, 515, 965))
cropped.save('scratch/pointing_exact_crop.png')
w, h = cropped.size
print(f"Cropped exact size: {w}x{h}")

# In cropped coordinates:
# Stylus tip: x = 502 - 45 = 457, y = 475 - 350 = 125!
# Hair top: y = 359 - 350 = 9!
img_bgr = cv2.imread('scratch/pointing_exact_crop.png')

# Precise Trimap for GrabCut
trimap = np.full((h, w), cv2.GC_PR_FGD, dtype=np.uint8)

# Definite Background:
# Top corners
trimap[0:15, 0:50] = cv2.GC_BGD
trimap[0:90, 310:] = cv2.GC_BGD
# Left side
trimap[:, 0:10] = cv2.GC_BGD
trimap[0:80, 0:40] = cv2.GC_BGD
# Right side outside arm:
# Arm extends up to x ~ 460 at y ~ 125 to 220
trimap[0:90, 460:] = cv2.GC_BGD
trimap[240:400, 430:] = cv2.GC_BGD
trimap[400:600, 425:] = cv2.GC_BGD
# Under arm gap between arm and waist:
# Back waist is x < 330, arm sleeve is x > 340, between them is white at y: 260 to 380
trimap[270:380, 320:340] = cv2.GC_BGD

# Definite Foreground:
# Hair bun core:
trimap[30:170, 90:230] = cv2.GC_FGD
# Red sweater core:
trimap[200:580, 70:310] = cv2.GC_FGD
# Right arm sleeve:
trimap[260:550, 345:410] = cv2.GC_FGD
# Right hand:
trimap[140:220, 395:435] = cv2.GC_FGD
# Stylus:
trimap[120:170, 435:465] = cv2.GC_FGD

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)
rect = (5, 5, w - 10, h - 10)

cv2.grabCut(img_bgr, trimap, rect, bgdModel, fgdModel, 8, cv2.GC_INIT_WITH_MASK)

mask = np.where((trimap == cv2.GC_FGD) | (trimap == cv2.GC_PR_FGD), 255, 0).astype('uint8')

# Morphological clean
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
alpha = cv2.GaussianBlur(mask, (3, 3), 0)

b, g, r = cv2.split(img_bgr)
rgba = cv2.merge([r, g, b, alpha])
Image.fromarray(rgba).save('scratch/pointing_cutout_v2.png')
print("Saved scratch/pointing_cutout_v2.png")

