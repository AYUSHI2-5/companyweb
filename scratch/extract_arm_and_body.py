import cv2
import numpy as np
from PIL import Image

# Load the avatar
img = cv2.imread('assets/teacher-avatar-user.png', cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]

# Hand + forearm region:
# Stylus tip: (124, 180)
# Top of hand: (160, 220)
# Knuckles: (195, 235)
# Wrist: (170, 290)
# Forearm / sleeve: x from 45 to 180, y from 260 to 360
# Pivot point: near elbow / lower sleeve (60, 360)

# Create arm mask
arm_mask = np.zeros((h, w), dtype=np.uint8)

# Polygon enclosing stylus, hand, wrist, and forearm
arm_pts = np.array([
    [120, 175], # stylus top
    [135, 190],
    [155, 220],
    [200, 228], # hand right
    [210, 255],
    [185, 285],
    [175, 320],
    [145, 370],
    [85, 380],
    [40, 340],
    [65, 280],
    [110, 220]
], np.int32)

cv2.fillPoly(arm_mask, [arm_pts], 255)
# intersect with actual character alpha
arm_mask = cv2.bitwise_and(arm_mask, img[:, :, 3])

# Save Arm Layer
arm_img = np.zeros_like(img)
arm_img[arm_mask > 0] = img[arm_mask > 0]
cv2.imwrite('scratch/arm_layer.png', arm_img)

# Body layer: inpaint the region under the arm
body_img = img.copy()
# Inpaint mask (slightly dilated arm mask)
inpaint_mask = cv2.dilate(arm_mask, np.ones((7, 7), np.uint8), iterations=2)
# But keep the face/neck/collar untouched!
# Neck is x > 185, y < 270
inpaint_mask[:270, 185:] = 0

body_bgr = cv2.cvtColor(body_img[:, :, :3], cv2.COLOR_RGB2BGR)
inpainted_bgr = cv2.inpaint(body_bgr, inpaint_mask, 9, cv2.INPAINT_TELEA)

body_img[:, :, :3] = cv2.cvtColor(inpainted_bgr, cv2.COLOR_BGR2RGB)
cv2.imwrite('scratch/body_layer.png', body_img)

print("Saved scratch/arm_layer.png and scratch/body_layer.png")

