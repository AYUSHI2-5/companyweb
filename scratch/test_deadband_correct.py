def calculate_card_index_correct(scrolled, vh, current_index, num_items=6):
    progress = scrolled / vh
    
    # Boundary clamping
    if progress >= num_items - 1:
        return num_items - 1
    if progress <= 0:
        return 0
    
    # If currently at current_index:
    # Next card is current_index + 1. The midpoint is current_index + 0.5.
    # We require progress > current_index + 0.55 to advance.
    # Previous card is current_index - 1. The midpoint is current_index - 0.5.
    # We require progress < current_index - 0.55 to retreat.
    
    # If the user jumped far (e.g. fast swipe), calculate directly:
    target = round(progress)
    target = max(0, min(num_items - 1, target))
    
    if target > current_index:
        # Check if progress has crossed the advance threshold (midpoint + 0.08)
        if progress > (current_index + 0.58):
            return target
        else:
            return current_index
    elif target < current_index:
        # Check if progress has dropped below the retreat threshold (midpoint - 0.08)
        if progress < (current_index - 0.58):
            return target
        else:
            return current_index
    else:
        return current_index

# Test jitter around midpoint 1.50 (where 1 and 2 meet)
vh = 800
curr = 1
print("Testing jitter starting from Card 1:")
for p in [1.40, 1.48, 1.50, 1.52, 1.55, 1.59, 1.55, 1.52, 1.48, 1.40, 1.35]:
    s = p * vh
    new_idx = calculate_card_index_correct(s, vh, curr)
    print(f"Progress: {p:.2f} -> Card {new_idx} (was {curr})")
    curr = new_idx

