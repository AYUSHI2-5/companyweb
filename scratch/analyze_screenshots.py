from PIL import Image
import numpy as np

# Let's inspect each screenshot to see its visual composition
shots = [
    'scratch/inspect_01_hero.png',
    'scratch/inspect_02_story.png',
    'scratch/inspect_03_features.png',
    'scratch/inspect_04_arch.png',
    'scratch/inspect_05_showcase.png',
    'scratch/inspect_06_contrib.png',
    'scratch/inspect_07_results.png',
    'scratch/inspect_08_related.png'
]

for s in shots:
    im = Image.open(s)
    arr = np.array(im)
    # Check average brightness
    avg_bright = np.mean(arr[:, :, :3])
    print(f"{s}: shape={arr.shape}, avg_brightness={avg_bright:.1f}")

