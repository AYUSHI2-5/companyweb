from PIL import Image
import numpy as np

# Load scratch/pointing_cutout_v2.png
img = Image.open('scratch/pointing_cutout_v2.png')
w, h = img.size
arr = np.array(img)

rgb = arr[:, :, :3]
alpha = arr[:, :, 3].copy()

# The ONLY background artifact in pointing_cutout_v2.png is in the gap:
# x from 250 to 370, y from 180 to 450
# In this region, background is white/light grey (r > 180, g > 180, b > 180) or faint line
for y in range(180, 460):
    for x in range(250, 380):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        # If it's bright background or line (not red sweater, not dark tablet, not skin)
        if (r > 175 and g > 165 and b > 165) or (r > 200 and g > 150 and b > 150):
            alpha[y, x] = 0

# And below the arm on the right (x > 410, y: 350 to 450):
for y in range(350, 460):
    for x in range(410, w):
        r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
        if (r > 175 and g > 165 and b > 165) or (r > 200 and g > 150 and b > 150):
            alpha[y, x] = 0

# Clean bottom edge
arr[:, :, 3] = alpha
final_img = Image.fromarray(arr).crop((0, 0, w, 575))
final_img.save('assets/teacher-pointing-avatar.png')
print("Pristine avatar saved to assets/teacher-pointing-avatar.png:", final_img.size)

