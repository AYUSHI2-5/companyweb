from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/.user_uploaded/media_1793609174693_af451703.jpg')
arr = np.array(img)

# Find black stylus in x: 400 to 600, y: 400 to 600
dark = (arr[400:650, 400:600, 0] < 60) & (arr[400:650, 400:600, 1] < 60) & (arr[400:650, 400:600, 2] < 60)
y_idx, x_idx = np.where(dark)

print(f"Stylus in full image: Y: {y_idx.min()+400} to {y_idx.max()+400}, X: {x_idx.min()+400} to {x_idx.max()+400}")
# Stylus tip
top_idx = np.argmin(y_idx)
print(f"Stylus tip at full image: x={x_idx[top_idx]+400}, y={y_idx[top_idx]+400}")

