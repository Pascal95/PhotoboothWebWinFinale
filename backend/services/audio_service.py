"""
Audio service.
Handles countdown beep and shutter-click sounds via pygame.
"""

import threading
import pygame

from constants import BEEP_SOUND_PATH, SHUTTER_SOUND_PATH

# Initialize mixer once at import time.
pygame.mixer.init()


def _play(path: str) -> None:
    """Load and play a sound file in a daemon thread (non-blocking)."""
    def _worker():
        try:
            sound = pygame.mixer.Sound(str(path))
            sound.play()
        except Exception as exc:
            print(f"[audio] Could not play {path}: {exc}")

    thread = threading.Thread(target=_worker, daemon=True)
    thread.start()


def play_beep() -> None:
    """Play the countdown beep sound."""
    _play(BEEP_SOUND_PATH)


def play_shutter() -> None:
    """Play the camera shutter-click sound."""
    _play(SHUTTER_SOUND_PATH)
