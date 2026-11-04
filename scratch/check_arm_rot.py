import cv2
import numpy as np

body = cv2.imread('assets/teacher-pointing-body.png', cv2.IMREAD_UNCHANGED)
arm = cv2.imread('assets/teacher-pointing-arm.png', cv2.IMREAD_UNCHANGED)

h, w = body.shape[:2]
pivot = (407, 272)

angles = [-18, -12, -6, 0, 6, 12, 16]

for angle in angles:
    M = cv2.getRotationMatrix2D(pivot, angle, 1.0)
    rot_arm = cv2.warpAffine(arm, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    comp = np.full((h, w, 3), 255, dtype=np.uint8)

    # Layer 1: rot_arm (forearm behind sleeve cuff)
    a_a = rot_arm[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (rot_arm[:, :, c] * a_a + comp[:, :, c] * (1 - a_a)).astype(np.uint8)

    # Layer 2: body (sleeve cuff on top)
    b_a = body[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (body[:, :, c] * b_a + comp[:, :, c] * (1 - b_a)).astype(np.uint8)

    cv2.imwrite(f'scratch/check_arm_rot_{angle}.png', comp)

print('Generated arm rotation check across all angles!')

