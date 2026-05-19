"""
Path utilities for Windows-safe file operations.
"""

from datetime import datetime
from pathlib import Path


def timestamped_filename(prefix: str, extension: str) -> str:
    """Generate a unique filename using the current timestamp."""
    ts = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    return f"{prefix}_{ts}.{extension.lstrip('.')}"


def ensure_dir(path: Path) -> Path:
    """Create directory (and parents) if it does not exist. Returns the path."""
    path.mkdir(parents=True, exist_ok=True)
    return path


def relative_static_path(full_path: Path, static_dir: Path) -> str:
    """
    Return a URL-style relative path from full_path relative to static_dir.
    Example: static/photos/photo_xyz.png  →  "photos/photo_xyz.png"
    """
    return full_path.relative_to(static_dir).as_posix()
