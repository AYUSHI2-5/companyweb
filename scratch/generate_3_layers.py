import cv2
import numpy as np

# Load source image
img = cv2.imread(r'C:\Users\Admin\.gemini\antigravity\brain\2e8adeb1-375c-4850-926c-403a790a7841\.user_uploaded\media_1793609174693_af451703.jpg')
crop = img[345:968, 35:515].copy()
h, w = crop.shape[:2]

# High precision GrabCut with smooth seeds
mask = np.full((h, w), cv2.GC_PR_BGD, dtype=np.uint8)
mask[:5, :] = cv2.GC_BGD
mask[:120, 300:] = cv2.GC_BGD
mask[:, w-5:] = cv2.GC_BGD
mask[:400, :10] = cv2.GC_BGD

mask[10:150, 100:230] = cv2.GC_FGD
mask[180:240, 130:200] = cv2.GC_FGD
mask[280:550, 100:360] = cv2.GC_FGD
mask[420:560, 280:350] = cv2.GC_FGD
mask[130:250, 370:430] = cv2.GC_FGD
mask[120:150, 410:460] = cv2.GC_FGD

bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)
cv2.grabCut(crop, mask, None, bgdModel, fgdModel, 8, cv2.GC_INIT_WITH_MASK)

alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype('uint8')
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(alpha)
main_label = max(range(1, num_labels), key=lambda i: stats[i, cv2.CC_STAT_AREA])
alpha = np.where(labels == main_label, 255, 0).astype('uint8')

# Fill internal cavities if any (e.g. within sweater)
contours, _ = cv2.findContours(alpha, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
solid_mask = np.zeros_like(alpha)
cv2.drawContours(solid_mask, contours, -1, 255, thickness=cv2.FILLED)

# High quality edge smoothing
alpha_smooth = cv2.bilateralFilter(solid_mask, 5, 50, 50)
alpha_smooth = cv2.GaussianBlur(alpha_smooth, (3, 3), 0.5)

full_teacher = cv2.cvtColor(crop, cv2.COLOR_BGR2BGRA)
full_teacher[:, :, 3] = alpha_smooth

# 1. Arm layer (Forearm, Hand, Stylus):
# Forearm starts at y <= 278, x >= 370
arm = np.zeros_like(full_teacher)
arm_cond = (np.arange(h)[:, None] <= 278) & (np.arange(w)[None, :] >= 370) & (alpha_smooth > 0)
arm[arm_cond] = full_teacher[arm_cond]

# Clean any pink stray artifact around y in [240, 265] where x < 392 or x > 425
for y in range(240, 266):
    for x in range(370, w):
        if arm[y, x, 3] > 0:
            if x < 392 or x > 425:
                # not sweater
                if arm[y, x, 2] > 170:
                    arm[y, x, 3] = 0

# 2. Head layer:
# Head is from y=0 down to the collar line (y ~ 228)
# Center of neck is around x=185, y=228
head = np.zeros_like(full_teacher)
head_cond = (np.arange(h)[:, None] <= 228) & (np.arange(w)[None, :] < 350) & (alpha_smooth > 0)
head[head_cond] = full_teacher[head_cond]

# 3. Body layer:
# Stationary torso, skirt, tablet, collar rim, and sleeve socket
body = full_teacher.copy()
# Zero out forearm
body[(np.arange(h)[:, None] < 270) & (np.arange(w)[None, :] >= 375)] = 0
# Zero out head above collar line (y < 220)
body[(np.arange(h)[:, None] < 220) & (np.arange(w)[None, :] < 350)] = 0

# Draw smooth red sweater sleeve cuff rim on body at (407, 272)
cuff_rim = [20, 25, 140, 255]
cv2.ellipse(body, (407, 272), (24, 5), 0, 0, 360, cuff_rim, -1)

# Draw smooth collar neckline rim on body so rotating head has clean behind-collar coverage
neck_rim = [240, 240, 245, 255]
cv2.ellipse(body, (185, 228), (28, 8), 0, 0, 360, neck_rim, -1)

cv2.imwrite('assets/teacher-pointing-arm.png', arm)
cv2.imwrite('assets/teacher-pointing-head.png', head)
cv2.imwrite('assets/teacher-pointing-body.png', body)

print('Generated clean 3 layers: arm, head, and body!')

