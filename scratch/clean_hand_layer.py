from PIL import Image
import numpy as np

img = Image.open('assets/teacher-hand-layer.png')
w, h = img.size
arr = np.array(img)

# Clear hair above the stylus:
# Stylus is angled from (124, 180) down to (160, 225)
# Anything with y < 178 should have alpha = 0
arr[:178, :, 3] = 0

# And for y between 178 and 220:
# The hair strand is at x > 135
# Stylus is strictly between x: 110 and x: 140 at y=180, and x: 135 and x: 165 at y=210
for y in range(178, 225):
    # Center of stylus line:
    # at y=180, center=125; at y=220, center=155
    center = 125 + (y - 180) * (155 - 125) / 40.0
    for x in range(w):
        if x < center - 14 or x > center + 14:
            arr[y, x, 3] = 0

cleaned_hand = Image.fromarray(arr)
cleaned_hand.save('assets/teacher-hand-layer.png')
print("Saved cleaned hand layer!")

