"""
Session service.
Orchestrates a photo capture session: captures one photo at a time,
stores it, and returns a URL-friendly relative path for the frontend.
"""

from pathlib import Path

from constants import PHOTOS_DIR, STATIC_DIR
from services.camera_service import capture_photo
from utils.path_utils import ensure_dir, relative_static_path, timestamped_filename


def capture_and_store_photo() -> str:
    """
    Capture one photo and save it to the photos directory.

    Returns the path relative to STATIC_DIR, suitable for constructing
    a URL: e.g. "photos/photo_20240101_120000_123456.jpg"
    """
    ensure_dir(PHOTOS_DIR)
    filename = timestamped_filename("photo", "jpg")
    output_path = PHOTOS_DIR / filename

    saved_path = capture_photo(output_path)
    return relative_static_path(saved_path, STATIC_DIR)
