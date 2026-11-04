import cv2
import numpy as np
from PIL import Image

# Let's inspect the crop
img = cv2.imread('scratch/user_avatar_crop.png')
h, w = img.shape[:2]

# Let's save a visualization of the avatar
# Let's find the exact outline of the woman
# We can create a mask:
# The woman consists of:
# 1. Hair: dark pixels (R < 80, G < 70, B < 70)
# 2. Skin: warm tones (R > 180, G > 140, B > 110, R > G > B)
# 3. Glasses: red (R > 140, G < 60, B < 60)
# 4. Sweater: red knit (R > 100, G < 50, B < 50) and white diamond pattern (R > 210, G > 200, B > 200 inside the sweater)
# 5. Shirt/collar: white (surrounded by neck and sweater)
# 6. Tablet: dark gray (R < 90, G < 95, B < 105)
# 7. Stylus: dark gray/black (R < 60, G < 60, B < 60)

# Outside background:
# The background is very pale gray/white (R > 230, G > 230, B > 230)
# and has the "LAST WEEK" pill (light blue/green tint and text)

print("Starting mask extraction...")

