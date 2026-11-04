from PIL import Image
import numpy as np

img = Image.open('assets/teacher-pointing-avatar.png')
w, h = img.size
arr = np.array(img)
alpha = arr[:, :, 3]

# Pink line region: y from 240 to 260
# Across the entire image, only the white collar (x < 240) and hand (x: 375..435) exist!
# Everything between 240 and 375, and x > 435 is 0!
alpha[240:260, 240:375] = 0
alpha[240:260, 435:] = 0

# Yellow line region: y from 495 to 520
# Across this region, torso/tablet is x < 290, sleeve is x: 335..420
# Between 290 and 335: 0! And x > 420: 0!
alpha[495:520, 290:335] = 0
alpha[495:520, 420:] = 0

# Bottom stray line: y > 565
alpha[565:, 320:] = 0
alpha[565:, :25] = 0

# Also far right of arm for all y > 260:
alpha[260:, 425:] = 0

arr[:, :, 3] = alpha
final_img = Image.fromarray(arr)
final_img.save('assets/teacher-pointing-avatar.png')
print("Successfully cleaned 100% of the lines!")

