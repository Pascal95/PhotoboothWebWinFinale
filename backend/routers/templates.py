"""
Templates router.
GET  /templates         → list all available templates
POST /templates         → create a new template (background image + cadres JSON)
DELETE /templates/{nom} → delete a template
"""

import json
import os

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from constants import TEMPLATES_DIR
from utils.path_utils import ensure_dir

router = APIRouter(tags=["templates"])


def _load_template_meta(json_path) -> dict:
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/templates")
def list_templates():
    if not TEMPLATES_DIR.exists():
        return {"templates": []}

    templates = []
    for file in TEMPLATES_DIR.iterdir():
        if file.suffix == ".json":
            try:
                templates.append(_load_template_meta(file))
            except Exception:
                pass  # Skip malformed files silently

    return {"templates": templates}


@router.post("/templates")
async def create_template(
    nom: str = Form(...),
    nombre_photos: int = Form(...),
    cadres: str = Form(...),          # JSON-encoded list of cadre objects
    mode: str = Form("classic"),      # "classic" or "overlay"
    image: UploadFile = File(...),
):
    ensure_dir(TEMPLATES_DIR)

    # Save background image
    suffix = os.path.splitext(image.filename)[1] or ".png"
    image_filename = f"{nom}{suffix}"
    image_path = TEMPLATES_DIR / image_filename

    content = await image.read()
    with open(image_path, "wb") as f:
        f.write(content)

    # Parse and validate cadres
    try:
        cadres_list = json.loads(cadres)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="cadres must be valid JSON")

    # Save template definition
    template_data = {
        "nom": nom,
        "image_fond": image_filename,
        "nombre_photos": nombre_photos,
        "cadres": cadres_list,
        **({"mode": "overlay"} if mode == "overlay" else {}),
    }
    json_path = TEMPLATES_DIR / f"{nom}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(template_data, f, indent=2, ensure_ascii=False)

    return {"success": True, "template": template_data}


@router.delete("/templates/{nom}")
def delete_template(nom: str):
    deleted = []
    for ext in [".json", ".png", ".jpg", ".jpeg"]:
        path = TEMPLATES_DIR / f"{nom}{ext}"
        if path.exists():
            path.unlink()
            deleted.append(path.name)

    if not deleted:
        raise HTTPException(status_code=404, detail=f"Template '{nom}' not found")

    return {"success": True, "deleted": deleted}
