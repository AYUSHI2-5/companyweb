from PIL import Image

img = Image.open(r'C:/Users/Admin/.gemini/antigravity/brain/2e8adeb1-375c-4850-926c-403a790a7841/.user_uploaded/media_1793604088763_14283fa4.jpg')
print("Image size:", img.size)

# Let's save a crop of the avatar area
# The avatar is centered horizontally in the bottom half
w, h = img.size
print("Width:", w, "Height:", h)

