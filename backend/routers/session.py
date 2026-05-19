"""
Session router.
Exposes the history of generated montages.
"""

import os
from datetime import datetime

from fastapi import APIRouter

from constants import API_PORT, EXPORTS_DIR

router = APIRouter(tags=["session"])

BASE_URL = f"http://localhost:{API_PORT}/static"


def _montage_to_dict(filename: str) -> dict:
    file_path = EXPORTS_DIR / filename
    stat = file_path.stat()
    return {
        "filename": filename,
        "path": f"exports/{filename}",
        "url": f"{BASE_URL}/exports/{filename}",
        "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
        "size": stat.st_size,
    }


@router.get("/history")
def get_history():
    """Return all montages sorted from newest to oldest."""
    if not EXPORTS_DIR.exists():
        return {"montages": []}

    files = sorted(
        [f for f in os.listdir(EXPORTS_DIR) if f.endswith(".png")],
        key=lambda f: (EXPORTS_DIR / f).stat().st_ctime,
        reverse=True,
    )
    return {"montages": [_montage_to_dict(f) for f in files]}
