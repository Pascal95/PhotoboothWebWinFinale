"""
Camera service.
Supports two capture modes:
  - CANON_DSLR : Canon EOS 2000D via digiCamControl (Windows)
  - WEBCAM     : Any OpenCV-compatible webcam (Logitech C920, etc.)

The live video preview is handled client-side by the browser (react-webcam).
This service is only responsible for capturing still photos.
"""

import subprocess
import time
from pathlib import Path

import cv2

from constants import (
    CAMERA_MODE_CANON,
    CAMERA_MODE_WEBCAM,
    CANON_CAPTURE_WAIT_SECONDS,
    DIGICAM_CMD,
    WEBCAM_DEFAULT_INDEX,
)
from services.config_service import get as get_config


# ── Canon EOS (digiCamControl) ────────────────────────────────────────────────

def _capture_canon(output_path: Path) -> Path:
    """
    Trigger Canon EOS 2000D via digiCamControl CLI and download the image.

    Requires digiCamControl installed at DIGICAM_CMD.
    https://digicamcontrol.com/
    """
    digicam = Path(DIGICAM_CMD)
    if not digicam.exists():
        raise FileNotFoundError(
            f"digiCamControl not found at {DIGICAM_CMD}. "
            "Please install it from https://digicamcontrol.com/"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)

    result = subprocess.run(
<<<<<<< HEAD
        [str(digicam), "/capture", "/filename", str(output_path)],
=======
        [str(digicam), "/capture", f"/filename:{output_path}"],
>>>>>>> d6fb0c4 (Initial commit)
        capture_output=True,
        text=True,
        timeout=30,
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"digiCamControl capture failed (code {result.returncode}): "
            f"{result.stderr or result.stdout}"
        )

    # Give the camera a moment to finish writing if the file isn't there yet
    deadline = time.time() + CANON_CAPTURE_WAIT_SECONDS
    while not output_path.exists() and time.time() < deadline:
        time.sleep(0.2)

    if not output_path.exists():
        raise RuntimeError(
            f"Canon capture succeeded but image not found at {output_path}"
        )

    return output_path


# ── Webcam (OpenCV) ───────────────────────────────────────────────────────────

<<<<<<< HEAD
def _open_webcam(index: int) -> cv2.VideoCapture:
    """Try MSMF → DSHOW → any backend, return the first that opens."""
    for backend in (cv2.CAP_MSMF, cv2.CAP_DSHOW, cv2.CAP_ANY):
        cap = cv2.VideoCapture(index, backend)
        if cap.isOpened():
            return cap
        cap.release()
    raise RuntimeError(f"Cannot open webcam at index {index} with any backend")


=======
>>>>>>> d6fb0c4 (Initial commit)
def _capture_webcam(output_path: Path) -> Path:
    """
    Capture a single frame from the configured webcam using OpenCV.
    Opens the device, grabs several frames to let auto-exposure settle,
    then saves the last one.
    """
    index = get_config("webcam_index", WEBCAM_DEFAULT_INDEX)
<<<<<<< HEAD
    cap = _open_webcam(index)
=======
    cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)  # CAP_DSHOW = Windows DirectShow
>>>>>>> d6fb0c4 (Initial commit)

    if not cap.isOpened():
        raise RuntimeError(f"Cannot open webcam at index {index}")

    try:
        # Warm up: grab a few frames so auto-exposure/white-balance stabilise
        for _ in range(5):
            cap.grab()

        ret, frame = cap.read()
        if not ret or frame is None:
            raise RuntimeError("Failed to read a frame from the webcam")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        success = cv2.imwrite(str(output_path), frame)
        if not success:
            raise RuntimeError(f"cv2.imwrite failed for path: {output_path}")

        return output_path
    finally:
        cap.release()


# ── Public API ────────────────────────────────────────────────────────────────

def capture_photo(output_path: Path) -> Path:
    """
    Capture a photo using the mode configured in config.json.
    Returns the path to the saved image.
    Raises on failure.
    """
    mode = get_config("mode", CAMERA_MODE_WEBCAM)

    if mode == CAMERA_MODE_CANON:
        return _capture_canon(output_path)
    elif mode == CAMERA_MODE_WEBCAM:
        return _capture_webcam(output_path)
    else:
        raise ValueError(f"Unknown camera mode: '{mode}'. Use 'canon' or 'webcam'.")


def list_webcam_devices() -> list[dict]:
    """
    Probe the first 6 device indices and return those that respond.
    Useful for the admin panel to let the user pick the right webcam.
    """
    devices = []
    for index in range(6):
<<<<<<< HEAD
        for backend in (cv2.CAP_MSMF, cv2.CAP_DSHOW, cv2.CAP_ANY):
            cap = cv2.VideoCapture(index, backend)
            if cap.isOpened():
                devices.append({"index": index, "label": f"Camera {index}"})
                cap.release()
                break
=======
        cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        if cap.isOpened():
            devices.append({"index": index, "label": f"Camera {index}"})
>>>>>>> d6fb0c4 (Initial commit)
            cap.release()
    return devices
