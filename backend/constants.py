"""
Application-wide constants.
All paths and configuration keys are defined here to avoid magic strings.
"""

from pathlib import Path

# ── Directories ───────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
PHOTOS_DIR = STATIC_DIR / "photos"
EXPORTS_DIR = STATIC_DIR / "exports"
TEMPLATES_DIR = BASE_DIR / "templates"
UPLOADS_DIR = BASE_DIR / "uploads"
ASSETS_DIR = BASE_DIR / "assets"
CONFIG_PATH = BASE_DIR / "config.json"
COUNTER_PATH = BASE_DIR / "print_counter.json"

# ── Camera ────────────────────────────────────────────────────────────────────
CAMERA_MODE_CANON = "canon"
CAMERA_MODE_WEBCAM = "webcam"
WEBCAM_DEFAULT_INDEX = 0

# digiCamControl command-line executable (Canon EOS capture on Windows)
DIGICAM_CMD = r"C:\Program Files (x86)\digiCamControl\CameraControlCmd.exe"

# Seconds to wait for Canon camera to write the image after trigger
CANON_CAPTURE_WAIT_SECONDS = 3

# ── Printing ──────────────────────────────────────────────────────────────────

DEFAULT_PRINTER_NAME = "DP-DS620"

# DNP DS620 native resolution: 300 DPI, 4x6" media (1200x1800 px)
DNP_PRINT_WIDTH_PX = 1800
DNP_PRINT_HEIGHT_PX = 1200

# ── Audio ─────────────────────────────────────────────────────────────────────
BEEP_SOUND_PATH = ASSETS_DIR / "bip.mp3"
SHUTTER_SOUND_PATH = ASSETS_DIR / "clickphoto.mp3"

# ── API ───────────────────────────────────────────────────────────────────────
API_HOST = "0.0.0.0"
API_PORT = 8000
ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
