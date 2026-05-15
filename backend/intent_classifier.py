def classify_intent(features: dict) -> str:
    pitch = features["pitch"]
    duration = features["duration"]
    tone = features["tone_direction"]
    intensity = features["intensity"]
    count = features["meow_count"]

    # Rule 1
    if pitch == "high" and duration == "short" and tone == "flat" and intensity == "medium" and count == 1:
        return "greeting"
    # Rule 7 checked before Rule 2: confusion is a specific subset of question
    # (same features but intensity=soft); if Rule 2 ran first it would always shadow Rule 7.
    if pitch == "high" and duration == "short" and tone == "rising" and intensity == "soft" and count == 1:
        return "confusion"
    # Rule 2
    if pitch == "high" and duration == "short" and tone == "rising" and count == 1:
        return "question"
    # Rule 3
    if duration == "short" and tone == "flat" and intensity == "medium" and count == 2:
        return "agreement"
    # Rule 4
    if pitch == "low" and duration == "medium" and tone == "falling" and intensity == "soft" and count == 1:
        return "disagreement"
    # Rule 5
    if duration == "long" and tone == "rising" and intensity == "loud" and count == 1:
        return "demand"
    # Rule 6
    if pitch == "mid" and duration == "medium" and tone == "flat" and intensity == "soft" and count >= 3:
        return "affection"
    # Rule 8
    if pitch == "high" and duration == "short" and tone == "flat" and intensity == "loud" and count >= 2:
        return "excitement"
    # Rule 9
    if pitch == "low" and duration == "long" and tone == "falling" and intensity == "soft" and count == 1:
        return "sadness"
    # Rule 10
    if pitch == "low" and duration == "short" and tone == "flat" and intensity == "loud" and count == 1:
        return "anger"

    return "unknown"
