def calculate_card_index(scrolled, vh, current_index, num_items=6):
    total_scroll = (num_items - 1) * vh
    if total_scroll <= 0:
        return 0
    
    progress = scrolled / vh
    
    # Hysteresis threshold: 0.45 threshold
    # To advance from current_index to current_index + 1: progress must exceed current_index + 0.45
    # To retreat from current_index to current_index - 1: progress must drop below current_index - 0.45
    
    if progress >= num_items - 1:
        return num_items - 1
    if progress <= 0:
        return 0
        
    # Check forward threshold
    if progress > current_index + 0.45:
        target = min(num_items - 1, int(progress + 0.55))
        return target
    # Check backward threshold
    elif progress < current_index - 0.45:
        target = max(0, int(progress + 0.45))
        return target
    else:
        return current_index

# Simulate scrolling down from 0 to 5000 with vh=800
vh = 800
curr = 0
print("Simulating scroll down:")
for s in range(0, 4200, 150):
    new_idx = calculate_card_index(s, vh, curr)
    if new_idx != curr:
        print(f"Scrolled: {s}px (progress {s/vh:.2f}) -> Changed card from {curr} to {new_idx}")
        curr = new_idx

print("\nSimulating small jitter around boundary (e.g. at 1200px):")
for s in [1180, 1200, 1220, 1190, 1210, 1185, 1205]:
    new_idx = calculate_card_index(s, vh, curr)
    print(f"Scrolled: {s}px (progress {s/vh:.2f}) -> Card {new_idx} (was {curr})")
    curr = new_idx

