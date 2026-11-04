import cv2
import numpy as np

body = cv2.imread('scratch/current_body_inspect.png', cv2.IMREAD_UNCHANGED)
h, w = body.shape[:2]

# The white shirt collar seam on the red sweater is around y=242
# Let's see: y < 242 is head, hair bun, glasses, earrings, neck and white collar!
# Below y=242 is the red sweater torso!
# Let's inspect the seam at y=242
head_layer = np.zeros_like(body)
head_layer[:245, :320] = body[:245, :320]

body_torso = body.copy()
# In body_torso, inpaint or cover the neck area with smooth sweater collar rim
body_torso[:240, :320] = 0

cv2.imwrite('scratch/test_head_layer.png', head_layer)
cv2.imwrite('scratch/test_torso_layer.png', body_torso)
print('Saved test head and torso layers!')

