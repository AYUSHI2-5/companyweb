import cv2
import numpy as np

# Load the unsevered pristine avatar
orig = cv2.imread('assets/teacher-pointing-avatar.png', cv2.IMREAD_UNCHANGED)
h, w = orig.shape[:2]
print('Original avatar dimensions:', w, h)

# In orig:
# Stylus tip is at (456, 134)
# Wrist enters sleeve cuff at y = 265, x from 394 to 422
# Sleeve cuff rim is at y = 265, x from 378 to 435
# Sleeve cuff socket pivot is at (406, 268)

# 1. ARM LAYER:
# Hand + Stylus + Forearm extending 35px DEEP into the sleeve (down to y = 300)
# Inside the sleeve (y > 265), we interpolate/extend the skin tone down so it has full overlap!
arm = np.zeros_like(orig)

# Copy everything for hand and stylus (y <= 265, x >= 365)
hand_mask = (np.arange(h)[:, None] <= 265) & (np.arange(w)[None, :] >= 365) & (orig[:, :, 3] > 0)
arm[hand_mask] = orig[hand_mask]

# For y from 265 to 305: forearm skin extends down inside cuff
# The forearm width is x from 393 to 423
for y in range(265, 305):
    for x in range(392, 424):
        # Sample skin tone from y=264
        arm[y, x] = orig[264, x]

# Soften bottom edge of extended forearm skin
arm[300:305, 392:424, 3] = np.linspace(255, 0, 5)[:, None]

# 2. BODY LAYER:
# Whole body from the original unsevered avatar, but zero out the hand and bare skin above y = 265
body = orig.copy()
# Zero out hand & stylus (y < 265, x >= 365)
body[(np.arange(h)[:, None] < 265) & (np.arange(w)[None, :] >= 365)] = 0

# Natural dark inner cuff rim at (406, 265) to give depth to the sleeve opening
# Draw realistic sleeve opening rim using sweater dark shadow color
inner_rim_color = [25, 20, 80, 255] # dark wine red shadow
cv2.ellipse(body, (406, 265), (18, 4), 0, 0, 360, inner_rim_color, 2)

# Save the two clean, unbroken layers
cv2.imwrite('scratch/new_arm_extended.png', arm)
cv2.imwrite('scratch/new_body_clean.png', body)

print('Saved new_arm_extended.png and new_body_clean.png')

# 3. Test rotations at -14, -8, 0, 6, 10 degrees
pivot = (406, 268)
for angle in [-14, -8, 0, 6, 10]:
    M = cv2.getRotationMatrix2D(pivot, angle, 1.0)
    rot_arm = cv2.warpAffine(arm, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    # Composite: rot_arm (z-index 1) behind body (z-index 2)
    comp = np.full((h, w, 3), 255, dtype=np.uint8)

    # 1. Arm
    a_a = rot_arm[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (rot_arm[:, :, c] * a_a + comp[:, :, c] * (1 - a_a)).astype(np.uint8)

    # 2. Body (sleeve cuff on top)
    b_a = body[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (body[:, :, c] * b_a + comp[:, :, c] * (1 - b_a)).astype(np.uint8)

    # Crop close-up around the hand and sleeve
    crop = comp[120:420, 320:470]
    cv2.imwrite(f'scratch/joint_test_{angle}.png', crop)

print('Generated joint tests across all angles!')

