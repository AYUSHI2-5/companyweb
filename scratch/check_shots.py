from PIL import Image

im_detail = Image.open('scratch/inspect_detail_hero_buttons.png')
im_admin = Image.open('scratch/inspect_admin_page.png')

print('Detail size:', im_detail.size)
print('Admin size:', im_admin.size)
