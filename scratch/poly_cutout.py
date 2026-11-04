import cv2
import numpy as np
from PIL import Image

orig = Image.open('scratch/pointing_exact_crop.png').convert('RGB')
w, h = orig.size
arr = np.array(orig)

# The character's silhouette polygon
body_poly = np.array([
    # Hair Bun top & left
    [170, 10],
    [125, 35],
    [95, 75],
    [90, 130],
    [110, 190],
    [130, 230],
    [155, 300],
    [175, 345],
    # Left shoulder & sleeve
    [120, 390],
    [75, 420],
    [40, 460],
    [15, 520],
    [10, 575],
    # Bottom waist
    [320, 575],
    # Tablet lower
    [315, 480],
    # Underarm join
    [300, 450],
    # Inner elbow & forearm
    [350, 380],
    [365, 320],
    [380, 260],
    # Hand
    [395, 220],
    [420, 190],
    # Stylus tip
    [458, 124],
    [464, 129],
    # Stylus upper & knuckles
    [435, 220],
    [430, 260],
    # Outer arm & elbow
    [415, 340],
    [415, 400],
    [395, 480],
    [355, 575],
    [320, 575],
    [300, 450],
    # Neck / Collar inner
    [255, 380],
    [250, 340],
    [260, 260],
    [275, 185],
    # Glasses & temple
    [285, 160],
    [270, 140],
    [240, 110],
    [205, 50],
    [170, 10]
], np.int32)

mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillPoly(mask, [body_poly], 255)

# Smooth edges with 3x3 gaussian
alpha_smooth = cv2.GaussianBlur(mask, (3, 3), 0)

rgba = np.zeros((575, w, 4), dtype=np.uint8)
rgba[:, :, :3] = arr[:575]
rgba[:, :, 3] = alpha_smooth[:575]

final_img = Image.fromarray(rgba)
final_img.save('assets/teacher-pointing-avatar.png')
print("Polygon cutout completed:", final_img.size)

