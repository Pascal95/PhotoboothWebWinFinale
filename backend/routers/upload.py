"""
Upload router.
Handles logo uploads for the photobooth interface.
"""

from fastapi import APIRouter, File, HTTPException, UploadFile

from constants import UPLOADS_DIR
from utils.path_utils import ensure_dir

router = APIRouter(tags=["upload"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".svg", ".webp"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/upload-logo")
async def upload_logo(file: UploadFile = File(...)):
    import os

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Use: {ALLOWED_EXTENSIONS}",
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 5 MB limit")

    ensure_dir(UPLOADS_DIR)
    dest = UPLOADS_DIR / file.filename
    with open(dest, "wb") as f:
        f.write(content)

    return {"success": True, "path": f"/uploads/{file.filename}"}
