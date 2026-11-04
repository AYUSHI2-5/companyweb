import cv2
import numpy as np
from PIL import Image

# 1. Clean teacher-hand-layer.png
hand_img = Image.open('assets/teacher-hand-layer.png')
w, h = hand_img.size
hand_arr = np.array(hand_img)

# Clear everything above the stylus cap (y < 210)
hand_arr[:210, :, 3] = 0
# Clear anything to the right of the hand (x > 225)
hand_arr[:, 225:, 3] = 0

cleaned_hand = Image.fromarray(hand_arr)
cleaned_hand.save('assets/teacher-hand-layer.png')
print("Cleaned hand layer saved!")

# 2. Re-create body layer with clean shirt & neckline
base_img = cv2.imread('assets/teacher-avatar-user.png', cv2.IMREAD_UNCHANGED)

# In the body layer, under the hand:
# The white shirt collar extends from (x: 180, y: 260) down to (x: 140, y: 340)
# And red sweater on the left (x < 140)
# Let's create an accurate inpainting
mask = np.zeros((h, w), dtype=np.uint8)
# Only mask the exact hand pixels
mask[hand_arr[:, :, 3] > 0] = 255
# Dilate by 3px
mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)

body_bgr = cv2.cvtColor(base_img[:, :, :3], cv2.COLOR_RGB2BGR)
inpainted_bgr = cv2.inpaint(body_bgr, mask, 5, cv2.INPAINT_TELEA)

body_final = base_img.copy()
body_final[:, :, :3] = cv2.cvtColor(inpainted_bgr, cv2.COLOR_BGR2RGB)
cv2.imwrite('assets/teacher-body-layer.png', body_final)
print("Cleaned body layer saved!")

