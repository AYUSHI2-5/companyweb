from PIL import Image
import numpy as np

for f in ['assets/teacher-pointing-body.png', 'assets/teacher-pointing-arm.png']:
    im = Image.open(f)
    arr = np.array(im)
    semi = (arr[:, :, 3] > 0) & (arr[:, :, 3] < 128)
    semi_white = semi & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 180) & (arr[:, :, 2] > 180)
    print(f, 'Remaining semi-transparent white pixels:', np.sum(semi_white))

