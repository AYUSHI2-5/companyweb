from PIL import Image
import numpy as np

img = Image.open('scratch/wrist_zoom.png')
# In wrist_zoom, x: 0..160 corresponds to main x: 80..240
# y: 0..170 corresponds to main y: 220..390
w, h = img.size
print(f"Wrist zoom size: {w}x{h}")
# Let's save a grid marked version of wrist_zoom so we can pinpoint exact pixel vertices
marked = img.copy()
import cv2
arr = np.array(marked)
# Draw grid lines every 20px
for x in range(0, w, 20):
    cv2.line(arr, (x, 0), (x, h), (0, 255, 0), 1)
for y in range(0, h, 20):
    cv2.line(arr, (0, y), (w, y), (0, 255, 0), 1)
Image.fromarray(arr).save('scratch/wrist_grid.png')
print("Saved scratch/wrist_grid.png")

