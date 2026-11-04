import cv2
import numpy as np
from PIL import Image

# Load the full cleaned avatar
img = cv2.imread('assets/teacher-avatar-user.png', cv2.IMREAD_UNCHANGED)
h, w = img.shape[:2]

# Create hand mask
# In coordinates of img (500 x 640):
# Stylus tip: (124, 180) to (210, 290)
# Knuckles: (170, 230)
# Palm: (160, 260)
# Thumb: (195, 250)
# Wrist: (130 to 180, 290 to 330)

# Let's draw an exact tight polygon for the hand + stylus:
pts = np.array([
    [120, 175],  # stylus top
    [135, 175],
    [175, 220],  # stylus above hand
    [190, 225],  # index finger top
    [208, 240],  # knuckle
    [215, 265],  # thumb tip / stylus lower
    [205, 285],  # lower stylus
    [185, 305],  # lower palm
    [175, 335],  # wrist cuff right
    [145, 335],  # wrist cuff left
    [125, 295],  # wrist left
    [120, 265],  # thumb base
    [112, 230],  # stylus mid
    [110, 195]   # stylus upper
], np.int32)

hand_mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillPoly(hand_mask, [pts], 255)

# Tweak with grabcut specifically on the hand box (x: 100-230, y: 170-340)
box_x1, box_x2 = 105, 225
box_y1, box_y2 = 170, 340

sub_img = img[box_y1:box_y2, box_x1:box_x2, :3]
sub_alpha = img[box_y1:box_y2, box_x1:box_x2, 3]

# Create hand layer
hand_layer = np.zeros_like(img)
# Smooth mask edges
hand_mask_smooth = cv2.GaussianBlur(hand_mask, (3, 3), 0)
for c in range(3):
    hand_layer[:, :, c] = img[:, :, c]
hand_layer[:, :, 3] = cv2.bitwise_and(img[:, :, 3], hand_mask_smooth)

cv2.imwrite('assets/teacher-hand-layer.png', hand_layer)
print("Saved assets/teacher-hand-layer.png")

# Now create the base body layer:
# In the base body layer, we want the neck and white collar behind where the hand moves
# When the hand rotates 15-25 degrees down/up, what is exposed?
# Mainly the white collar / neck under the hand!
body_layer = img.copy()

# Inpaint the region under the hand in the body layer
# Telea inpainting fills smoothly from surrounding shirt/collar
inpaint_mask = cv2.dilate(hand_mask, np.ones((5, 5), np.uint8), iterations=2)
# Keep avatar outside boundary clean
inpaint_mask = cv2.bitwise_and(inpaint_mask, img[:, :, 3])

body_bgr = cv2.cvtColor(body_layer[:, :, :3], cv2.COLOR_RGB2BGR)
inpainted_bgr = cv2.inpaint(body_bgr, inpaint_mask, 7, cv2.INPAINT_TELEA)

body_layer[:, :, :3] = cv2.cvtColor(inpainted_bgr, cv2.COLOR_BGR2RGB)
cv2.imwrite('assets/teacher-body-layer.png', body_layer)
print("Saved assets/teacher-body-layer.png")

