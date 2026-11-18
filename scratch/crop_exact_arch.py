from PIL import Image

im = Image.open('scratch/project_full_page.png')
print('Image size:', im.size)

# Crop architecture section (Y: 3400 to 4800)
arch_crop = im.crop((0, 3400, im.size[0], min(4800, im.size[1])))
arch_crop.save('scratch/exact_arch_crop.png')
print('Saved scratch/exact_arch_crop.png with size:', arch_crop.size)

# Check average brightness of this exact crop
import numpy as np
arr = np.array(arch_crop)
print('Exact Architecture Crop Average Brightness:', np.mean(arr[:, :, :3]))
print('Dark pixels in exact crop:', np.sum(arr[:, :, 0] < 50))

