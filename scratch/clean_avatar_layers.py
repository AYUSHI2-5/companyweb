from PIL import Image
import numpy as np

def clean_avatar_layer(filepath):
    im = Image.open(filepath).convert('RGBA')
    arr = np.array(im, dtype=np.float32)
    
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # 1. Any low-alpha pixel (< 75) that is predominantly white (> 185): it is pure background remnant, set alpha to 0
    bg_mask = (a > 0) & (a < 75) & (r > 185) & (g > 185) & (b > 185)
    arr[bg_mask, 3] = 0.0
    
    # 2. For remaining semi-transparent pixels on boundary (0 < a < 250):
    # Unpremultiply against white background (255, 255, 255)
    semi = (arr[:, :, 3] > 0) & (arr[:, :, 3] < 250)
    a_norm = arr[semi, 3] / 255.0
    
    for c_idx in range(3):
        c_obs = arr[semi, c_idx]
        c_unpre = (c_obs - 255.0 * (1.0 - a_norm)) / np.maximum(a_norm, 0.05)
        arr[semi, c_idx] = np.clip(c_unpre, 0.0, 255.0)
        
    # 3. Clean any remaining semi-white edge pixels
    remaining_white_edge = (arr[:, :, 3] > 0) & (arr[:, :, 3] < 120) & (arr[:, :, 0] > 200) & (arr[:, :, 1] > 200) & (arr[:, :, 2] > 200)
    arr[remaining_white_edge, 3] = 0.0
    
    # 4. Clean stray top-left pixels (x < 50, y < 100)
    stray_tl = (np.arange(arr.shape[0])[:, None] < 100) & (np.arange(arr.shape[1])[None, :] < 50)
    arr[stray_tl, 3] = 0.0
    
    clean_im = Image.fromarray(np.uint8(arr), 'RGBA')
    clean_im.save(filepath, 'PNG')
    print(f'Successfully cleaned {filepath}')

clean_avatar_layer('assets/teacher-pointing-body.png')
clean_avatar_layer('assets/teacher-pointing-arm.png')
clean_avatar_layer('assets/teacher-pointing-avatar.png')

