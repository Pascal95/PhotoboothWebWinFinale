"""
Capture router.
Exposes the photo capture and montage generation endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.montage_service import generate_montage
from services.session_service import capture_and_store_photo

router = APIRouter(tags=["capture"])


class GenerateMontageRequest(BaseModel):
    photo_paths: list[str]


@router.get("/capture-photo")
def capture_photo_endpoint():
    """Capture one photo and return its relative URL path."""
    try:
        photo_path = capture_and_store_photo()
        return {"success": True, "photo_path": photo_path}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/generate-montage")
def generate_montage_endpoint(payload: GenerateMontageRequest):
    """Composite the provided photos into a montage and return its path."""
    if not payload.photo_paths:
        raise HTTPException(status_code=400, detail="photo_paths cannot be empty")
    try:
        montage_path = generate_montage(payload.photo_paths)
        return {"success": True, "montage_path": montage_path}
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
