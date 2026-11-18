from PIL import Image

body = Image.open('assets/teacher-pointing-body.png')
arm = Image.open('assets/teacher-pointing-arm.png')

comp = Image.new('RGBA', body.size, (0, 0, 0, 0))
comp.paste(arm, (0, 0), arm)
comp.paste(body, (0, 0), body)

# Test against grey, dark, white
bg_grey = Image.new('RGB', body.size, (240, 240, 240))
bg_grey.paste(comp, (0, 0), comp)
bg_grey.save('scratch/full_avatar_test.png')
print('Saved full_avatar_test.png')

