import cv2
import numpy as np

# Let's check text and box density
for idx in range(1, 7):
    fn = f'scratch/diag_0{idx}_*.png'
    import glob
    matches = glob.glob(fn)
    if matches:
        f = matches[0]
        im = cv2.imread(f)
        gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
        # Find horizontal borders or white space
        row_means = np.mean(gray, axis=1)
        white_rows = np.sum(row_means > 250)
        print(f"{f}: total rows={im.shape[0]}, white space rows={white_rows} ({white_rows/im.shape[0]*100:.1f}%)")

