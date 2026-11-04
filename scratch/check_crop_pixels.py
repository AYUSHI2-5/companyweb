from PIL import Image
import numpy as np

img = Image.open('scratch/user_avatar_crop.png').convert('RGB')
w, h = img.size
print(f"Crop size: {w}x{h}")

# Let's inspect the horizontal profile and color ranges
arr = np.array(img)
print("Top-left pixel:", arr[0, 0])
print("Top-right pixel:", arr[0, w-1])
print("Bottom-left pixel:", arr[h-1, 0])
print("Bottom-right pixel:", arr[h-1, w-1])

