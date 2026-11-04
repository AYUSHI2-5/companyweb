import cv2
import numpy as np

img = cv2.imread('scratch/user_avatar_crop.png')
h, w = img.shape[:2]

# Let's see edge map
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 30, 100)

# Also let's check color distance from the background
# The background in the corners is very close to white/light grey
# Whereas the person has dark hair, red cardigan, skin, dark tablet
print("Image shape:", img.shape)

