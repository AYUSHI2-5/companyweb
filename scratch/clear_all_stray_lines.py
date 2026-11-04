from PIL import Image
import numpy as np

img = Image.open('assets/teacher-pointing-avatar.png')
w, h = img.size
arr = np.array(img)
alpha = arr[:, :, 3]

# 1. Open air gap between torso and raised arm
for y in range(215, 440):
    for x in range(240, 350):
        alpha[y, x] = 0

for y in range(440, 540):
    for x in range(290, 345):
        alpha[y, x] = 0

# 2. Open air to the right of the arm
for y in range(260, 560):
    for x in range(420, w):
        alpha[y, x] = 0

# 3. Open air above hand / right of stylus
for y in range(0, 200):
    for x in range(460, w):
        alpha[y, x] = 0

# 4. Yellow line at bottom below tablet (y > 510, x between 285 and 330)
for y in range(510, 560):
    for x in range(285, 335):
        alpha[y, x] = 0

arr[:, :, 3] = alpha
final = Image.fromarray(arr)
final.save('assets/teacher-pointing-avatar.png')
print("Saved final pointing avatar without any lines!")

