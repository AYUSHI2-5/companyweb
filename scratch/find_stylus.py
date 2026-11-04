from PIL import Image
import numpy as np

img = Image.open('assets/teacher-avatar-user.png')
arr = np.array(img)
w, h = img.size

# Find the stylus: dark pixels in x: 100 to 220, y: 190 to 280
# Stylus is black: r < 60, g < 60, b < 60
stylus_mask = (arr[:, :, 0] < 70) & (arr[:, :, 1] < 70) & (arr[:, :, 2] < 70) & (arr[:, :, 3] > 100)
# restrict to the left side
y_coords, x_coords = np.where(stylus_mask[:350, :250])
print(f"Stylus Y range: {y_coords.min()} to {y_coords.max()}")
print(f"Stylus X range: {x_coords.min()} to {x_coords.max()}")

# Stylus top tip
idx = np.argmin(y_coords)
print(f"Stylus tip at: x={x_coords[idx]}, y={y_coords[idx]}")

