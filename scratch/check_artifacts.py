from PIL import Image
import numpy as np

body = Image.open('assets/teacher-pointing-body.png')
arr_b = np.array(body)

# In clear_all_stray_lines.py:
# 1. Open air gap between torso and raised arm
# y from 215 to 440, x from 240 to 350
gap1 = arr_b[215:440, 240:350, 3]
print('Active pixels in gap1 (y 215..440, x 240..350):', np.sum(gap1 > 0))

# 4. Yellow line at bottom below tablet (y > 510, x between 285 and 330)
gap4 = arr_b[510:560, 285:335, 3]
print('Active pixels in gap4 (y 510..560, x 285..335):', np.sum(gap4 > 0))
if np.sum(gap4 > 0) > 0:
    print('Colors in gap4:', arr_b[510:560, 285:335, :3][gap4 > 0][:5])

# Check right of arm / stylus in arm:
arm = Image.open('assets/teacher-pointing-arm.png')
arr_a = np.array(arm)
print('Arm shape:', arr_a.shape)

