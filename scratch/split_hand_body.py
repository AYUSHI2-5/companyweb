import cv2
import numpy as np
from PIL import Image

# Load the cleaned avatar
img_rgba = Image.open('assets/teacher-avatar-user.png')
w, h = img_rgba.size
arr = np.array(img_rgba)

# 1. Hand + Stick Mask
# Hand box roughly: x from 115 to 235, y from 195 to 335
hand_mask = np.zeros((h, w), dtype=np.uint8)

# Polygon around the stylus and hand:
# Stylus tip: (120, 205)
# Top of knuckles: (165, 225)
# Thumb / index: (195, 245)
# Outer palm: (220, 275)
# Wrist cuff: (185, 330), (145, 320)
# Base of thumb / sleeve: (135, 280)
pts = np.array([
    [118, 200], # stick tip
    [135, 215],
    [165, 225],
    [205, 235],
    [225, 260],
    [220, 285],
    [205, 325], # wrist
    [160, 335], # wrist
    [138, 305],
    [132, 275],
    [120, 245],
    [112, 215]
], np.int32)

cv2.fillPoly(hand_mask, [pts], 255)

# Keep only where the avatar is non-transparent
hand_mask = cv2.bitwise_and(hand_mask, arr[:, :, 3])

# Save Hand Layer (with transparent background)
hand_rgba = np.zeros_like(arr)
hand_rgba[hand_mask > 0] = arr[hand_mask > 0]

Image.fromarray(hand_rgba).save('scratch/avatar_hand_layer.png')
print("Saved scratch/avatar_hand_layer.png")

# Now inpaint the body behind the hand
body_bgr = cv2.cvtColor(arr, cv2.COLOR_RGBA2BGR)
# Dilate hand mask for inpainting
inpaint_mask = cv2.dilate(hand_mask, np.ones((5, 5), np.uint8), iterations=2)
inpainted_bgr = cv2.inpaint(body_bgr, inpaint_mask, 7, cv2.INPAINT_TELEA)

# Restore alpha for body
body_rgba = np.zeros_like(arr)
body_rgba[:, :, :3] = cv2.cvtColor(inpainted_bgr, cv2.COLOR_BGR2RGB)
body_rgba[:, :, 3] = arr[:, :, 3]

Image.fromarray(body_rgba).save('scratch/avatar_body_layer.png')
print("Saved scratch/avatar_body_layer.png")

