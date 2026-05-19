"""
Configuration router.
GET returns the full config, POST replaces it entirely.
"""

from fastapi import APIRouter, HTTPException

from services.config_service import load_config, save_config

router = APIRouter(tags=["config"])


@router.get("/config")
def get_config():
    return load_config()


@router.post("/config")
def update_config(new_config: dict):
    try:
        save_config(new_config)
        return {"success": True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
