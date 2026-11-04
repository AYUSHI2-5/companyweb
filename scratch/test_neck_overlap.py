import cv2
import numpy as np

body_full = cv2.imread('scratch/current_body_inspect.png', cv2.IMREAD_UNCHANGED)
h, w = body_full.shape[:2]

# Head pivot at (185, 235)
head_pivot = (185, 235)

# 1. Head layer: everything from y=0 to y=250 (extends 12px below collar line into sweater)
head = np.zeros_like(body_full)
head[:250, :320] = body_full[:250, :320]

# 2. Torso base: body with head area above y=235 cleared, but keeping the collar/sweater rim
torso = body_full.copy()
# Clear head above y=230
torso[:230, :320] = 0

# 3. Collar overlap mask:
# The front rim of the red sweater collar is at y: 230..255, x: 130..240
# In front of the neck, the sweater collar forms a natural V/crew rim
collar_front = np.zeros_like(body_full)
collar_front[230:260, 130:250] = body_full[230:260, 130:250]

# Let's test rotating head by -4, -2, 0, 2, 4 degrees
for angle in [-4, -2, 0, 2, 4]:
    M = cv2.getRotationMatrix2D(head_pivot, angle, 1.0)
    rot_head = cv2.warpAffine(head, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    # Composite:
    # 1. Torso
    comp = np.full((h, w, 3), 255, dtype=np.uint8)
    t_a = torso[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (torso[:, :, c] * t_a + comp[:, :, c] * (1 - t_a)).astype(np.uint8)

    # 2. Rotated Head
    h_a = rot_head[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (rot_head[:, :, c] * h_a + comp[:, :, c] * (1 - h_a)).astype(np.uint8)

    # 3. Front collar rim overlay
    c_a = collar_front[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (collar_front[:, :, c] * c_a + comp[:, :, c] * (1 - c_a)).astype(np.uint8)

    cv2.imwrite(f'scratch/neck_rot_test_{angle}.png', comp)

print('Generated neck rotation tests with collar overlap!')

