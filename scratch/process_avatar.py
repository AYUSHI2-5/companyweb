from PIL import Image, ImageFilter
import numpy as np
from collections import deque

def make_transparent(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size
    data = np.array(img)
    
    # RGB channels
    r = data[:, :, 0].astype(np.float32)
    g = data[:, :, 1].astype(np.float32)
    b = data[:, :, 2].astype(np.float32)
    
    # White distance: distance from pure white (255, 255, 255)
    # Brightness threshold: pure or near pure white
    is_near_white = (r > 240) & (g > 240) & (b > 240)
    
    # Exterior flood fill BFS from the edges
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()
    
    # Add top, left, right edges (and bottom outside character)
    for x in range(w):
        if is_near_white[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_near_white[h-1, x] and (x < 150 or x > 750): # bottom corners outside desk
            queue.append((h-1, x))
            visited[h-1, x] = True
            
    for y in range(h):
        if is_near_white[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_near_white[y, w-1]:
            queue.append((y, w-1))
            visited[y, w-1] = True
            
    # Directions for 4-connectivity
    dy = [-1, 1, 0, 0]
    dx = [0, 0, -1, 1]
    
    while queue:
        cy, cx = queue.popleft()
        for i in range(4):
            ny, nx = cy + dy[i], cx + dx[i]
            if 0 <= ny < h and 0 <= nx < w:
                if not visited[ny, nx] and is_near_white[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Visited contains exterior white background
    # Create smooth alpha channel
    alpha = np.ones((h, w), dtype=np.uint8) * 255
    alpha[visited] = 0
    
    # To smooth edges, let's create a transition zone for pixels near boundary
    # Smooth alpha mask
    mask_img = Image.fromarray(alpha, mode='L')
    # Slight feathering
    mask_smooth = mask_img.filter(ImageFilter.GaussianBlur(radius=1.2))
    
    # Assign new alpha channel
    img.putalpha(mask_smooth)
    img.save(output_path, 'PNG')
    print(f"Successfully created transparent PNG: {output_path}")

if __name__ == '__main__':
    make_transparent('assets/teacher-avatar.jpg', 'assets/teacher-avatar.png')

