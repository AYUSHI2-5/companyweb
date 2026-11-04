import cv2
import numpy as np

body = cv2.imread('assets/teacher-pointing-body.png', cv2.IMREAD_UNCHANGED)
head = cv2.imread('assets/teacher-pointing-head.png', cv2.IMREAD_UNCHANGED)
arm = cv2.imread('assets/teacher-pointing-arm.png', cv2.IMREAD_UNCHANGED)

h, w = body.shape[:2]

arm_pivot = (407, 272)
head_pivot = (185, 225)

# Test combinations: (arm_angle, head_angle)
tests = [
    (-15, -3), # pointing high up, head tilted up
    (-6, -1),  # intermediate high
    (0, 0),    # neutral center
    (8, 2),    # pointing lower
    (16, 4)    # pointing bottom
]

for arm_angle, head_angle in tests:
    # 1. Rotate arm
    M_arm = cv2.getRotationMatrix2D(arm_pivot, arm_angle, 1.0)
    rot_arm = cv2.warpAffine(arm, M_arm, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    # 2. Rotate head
    M_head = cv2.getRotationMatrix2D(head_pivot, head_angle, 1.0)
    rot_head = cv2.warpAffine(head, M_head, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)

    # 3. Composite onto body: Body -> Head -> Arm
    comp = np.full((h, w, 3), 255, dtype=np.uint8)

    # Layer 1: Body
    body_a = body[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (body[:, :, c] * body_a + comp[:, :, c] * (1 - body_a)).astype(np.uint8)

    # Layer 2: Head
    head_a = rot_head[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (rot_head[:, :, c] * head_a + comp[:, :, c] * (1 - head_a)).astype(np.uint8)

    # Layer 3: Arm
    arm_a = rot_arm[:, :, 3] / 255.0
    for c in range(3):
        comp[:, :, c] = (rot_arm[:, :, c] * arm_a + comp[:, :, c] * (1 - arm_a)).astype(np.uint8)

    cv2.imwrite(f'scratch/test_pose_{arm_angle}_{head_angle}.png', comp)

print('Generated composite test poses!')

