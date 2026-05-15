import io
import numpy as np
import soundfile as sf
import librosa


def extract_features(audio_bytes: bytes) -> dict:
    buf = io.BytesIO(audio_bytes)
    y, sr = sf.read(buf)

    if y.ndim > 1:
        y = y.mean(axis=1)

    y = y.astype(np.float32)

    if sr != 22050:
        y = librosa.resample(y, orig_sr=sr, target_sr=22050)
        sr = 22050

    # Pitch
    pitches = librosa.yin(y, fmin=50, fmax=800, sr=sr)
    nonzero = pitches[pitches > 0]
    median_pitch = float(np.median(nonzero)) if len(nonzero) > 0 else 0.0
    if median_pitch < 200:
        pitch = "low"
    elif median_pitch <= 400:
        pitch = "mid"
    else:
        pitch = "high"

    # Duration
    duration_sec = len(y) / sr
    if duration_sec < 0.4:
        duration = "short"
    elif duration_sec <= 1.2:
        duration = "medium"
    else:
        duration = "long"

    # Tone direction — split into thirds
    third = len(y) // 3
    def median_pitch_segment(segment):
        p = librosa.yin(segment, fmin=50, fmax=800, sr=sr)
        nz = p[p > 0]
        return float(np.median(nz)) if len(nz) > 0 else 0.0

    p1 = median_pitch_segment(y[:third])
    p3 = median_pitch_segment(y[2 * third:])
    if p3 > p1 + 20:
        tone_direction = "rising"
    elif p1 > p3 + 20:
        tone_direction = "falling"
    else:
        tone_direction = "flat"

    # Intensity
    rms = librosa.feature.rms(y=y)
    mean_rms = float(rms.mean())
    if mean_rms < 0.02:
        intensity = "soft"
    elif mean_rms <= 0.06:
        intensity = "medium"
    else:
        intensity = "loud"

    # Meow count
    onsets = librosa.onset.onset_detect(y=y, sr=sr)
    meow_count = len(onsets)

    return {
        "pitch": pitch,
        "duration": duration,
        "tone_direction": tone_direction,
        "intensity": intensity,
        "meow_count": meow_count,
    }
