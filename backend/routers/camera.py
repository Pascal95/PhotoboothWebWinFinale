"""
Camera router.
Utility endpoints for camera device discovery (admin panel).
"""

from fastapi import APIRouter

from services.camera_service import list_webcam_devices

router = APIRouter(tags=["camera"])


@router.get("/camera/devices")
def get_camera_devices():
    """Return webcam devices detected by OpenCV on this machine."""
    return {"devices": list_webcam_devices()}
