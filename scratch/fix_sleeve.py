import cv2
import numpy as np
from PIL import Image

# Start fresh from scratch/pointing_cutout_v2.png
img = Image.open('scratch/pointing_cutout_v2.png')
w, h = img.size
data = np.array(img)
alpha = data[:, :, 3].copy()
rgb = data[:, :, :3]

# In pointing_cutout_v2.png, her sleeve is solid red!
# Let's inspect what was outside the sleeve:
# Neck & Collar ends at x ~ 250, y ~ 200..300
# Below collar, the back of the sweater is at x < 300
# Tablet is at x: 280..315, y: 460..530
# The gap is strictly between the back/tablet and the raised right arm
# The raised arm inner edge:
# At y=200, arm hand is at x=395
# At y=250, wrist is at x=380
# At y=300, forearm is at x=365
# At y=350, elbow is at x=355
# At y=400, bicep is at x=330
# At y=450, underarm joins torso at x=300
# So anything between x: 245 and the inner arm contour is background!
# Let's define the polygon for the background gap:
gap_polygon = np.array([
    [245, 230],  # below collar
    [270, 230],
    [285, 250],  # near neck
    [380, 240],  # under wrist
    [360, 290],  # inner forearm
    [345, 350],  # inner elbow
    [320, 420],  # inner bicep
    [295, 460],  # tablet top
    [245, 430]   # back of sweater
], np.int32)

gap_mask = np.zeros((h, w), dtype=np.uint8)
cv2.fillPoly(gap_mask, [gap_polygon], 255)

# Also the horizontal line to the right of the arm:
# Arm outer edge is at x ~ 430 (y: 200..300), x ~ 415 (y: 300..400), x ~ 390 (y: 400..500)
# Outside of that (x > 430 at y > 240):
right_bg = np.zeros((h, w), dtype=np.uint8)
right_pts = np.array([
    [435, 240],
    [w, 240],
    [w, 550],
    [400, 550],
    [415, 450],
    [430, 350]
], np.int32)
cv2.fillPoly(right_bg, [right_pts], 255)

# Apply deletions to alpha
alpha[gap_mask > 0] = 0
alpha[right_bg > 0] = 0

# Bottom left yellow spot (x < 85, y > 570)
alpha[570:, :85] = 0

# Smooth alpha edges
alpha_smooth = cv2.GaussianBlur(alpha, (3, 3), 0)
data[:, :, 3] = alpha_smooth

cleaned = Image.fromarray(data).crop((0, 0, w, 580))
cleaned.save('assets/teacher-pointing-avatar.png')
print("Cleaned avatar successfully saved to assets/teacher-pointing-avatar.png")

