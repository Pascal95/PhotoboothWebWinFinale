"""
Print router.
Sends a montage to the DNP DS620 printer.
Also exposes a list of available Windows printers for the admin panel.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from constants import STATIC_DIR
from services.counter_service import get_count, increment, reset as reset_counter
from services.print_service import list_printers, print_photo

router = APIRouter(tags=["print"])


class PrintRequest(BaseModel):
    image_path: str   # relative to STATIC_DIR, e.g. "exports/session_xxx.png"
    copies: int = 1


@router.post("/print")
def print_image(payload: PrintRequest):
    absolute_path = STATIC_DIR / payload.image_path
    try:
        print_photo(absolute_path, copies=payload.copies)
        count = increment(payload.copies)
        return {"success": True, "message": "Impression lancée", "print_count": count}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/print-count")
def get_print_count():
    return {"count": get_count()}


@router.post("/print-count/reset")
def reset_print_count():
    return {"count": reset_counter()}


@router.get("/printers")
def get_printers():
    """Return the list of printers registered on this Windows machine."""
    return {"printers": list_printers()}
