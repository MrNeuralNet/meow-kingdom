def compute_stature_delta(relationship_delta: int) -> int:
    if relationship_delta > 0:
        return 2
    elif relationship_delta < 0:
        return -1
    return 0
