from PIL import Image
import numpy as np

img = Image.open('assets/teacher-pointing-avatar.png')
w, h = img.size
arr = np.array(img)
alpha = arr[:, :, 3]

# In the open air:
# 1. At y > 230, the arm is strictly at x < 425!
# So for x > 425 and y > 230, it is 100% background air!
alpha[230:, 425:] = 0

# 2. In the gap between torso and arm:
# Torso ends at x < 240 (at y: 240..300)
# Arm sleeve starts at x > 360 (at y: 240..300)
# Between x: 245 and 365, y: 240..260 (the pink line across the gap):
alpha[240:260, 245:365] = 0

# 3. Yellow line across gap at y: 500..515:
# Torso ends at x < 320, arm is at x > 330:
alpha[500:515, 290:330] = 0

# 4. Under the hand/stylus on the left of the stylus (y < 230):
# Stylus is at x: 420 to 465. To the right of stylus (x > 465, y < 230):
alpha[:230, 465:] = 0
# To the left of hand (x: 275 to 380, y: 210 to 240):
alpha[210:240, 275:380] = 0

arr[:, :, 3] = alpha
final_img = Image.fromarray(arr)
final_img.save('assets/teacher-pointing-avatar.png')
print("Successfully removed pink and yellow lines!")

