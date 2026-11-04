import cv2
import numpy as np
from PIL import Image

# Load full avatar
img = cv2.imread('assets/teacher-avatar-user.png', cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]

# Exact contour of stylus + hand:
# Offset from wrist_zoom (offset_x=80, offset_y=220):
local_pts = [
    [44, -40],   # stylus top cap
    [54, -34],
    [84, 8],     # stylus entering hand
    [98, 73],    # index finger base
    [109, 74],   # index finger knuckle
    [125, 93],   # index tip touching stylus
    [142, 122],  # stylus bottom cap
    [135, 134],
    [118, 122],  # thumb underneath
    [98, 140],   # thumb knuckle
    [78, 160],   # wrist cuff lower right
    [50, 160],   # wrist cuff lower left
    [55, 120],   # palm left
    [65, 80],    # thumb base
    [70, 40],    # stylus mid left
    [34, -28]    # stylus top left
]

pts = np.array([[x + 80, y + 220] for x, y in local_pts], np.int32)

hand_mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillPoly(hand_mask, [pts], 255)

# Keep only where the character is non-transparent
hand_mask = cv2.bitwise_and(hand_mask, img[:, :, 3])

# Create hand layer
hand_layer = np.zeros_like(img)
hand_mask_smooth = cv2.GaussianBlur(hand_mask, (3, 3), 0)
for c in range(3):
    hand_layer[:, :, c] = img[:, :, c]
hand_layer[:, :, 3] = cv2.bitwise_and(img[:, :, 3], hand_mask_smooth)

cv2.imwrite('assets/teacher-hand-layer.png', hand_layer)
print("Saved assets/teacher-hand-layer.png")

# Now inpaint the region under the hand in the body layer
body_layer = img.copy()
inpaint_mask = cv2.dilate(hand_mask, np.ones((7, 7), np.uint8), iterations=2)
# Keep avatar outside boundary clean
inpaint_mask = cv2.bitwise_and(inpaint_mask, img[:, :, 3])
# Keep chin and neck top untouched
inpaint_mask[:240, 180:] = 0

body_bgr = cv2.cvtColor(body_layer[:, :, :3], cv2.COLOR_RGB2BGR)
inpainted_bgr = cv2.inpaint(body_bgr, inpaint_mask, 9, cv2.INPAINT_TELEA)

body_layer[:, :, :3] = cv2.cvtColor(inpainted_bgr, cv2.COLOR_BGR2RGB)
cv2.imwrite('assets/teacher-body-layer.png', body_layer)
print("Saved assets/teacher-body-layer.png")

