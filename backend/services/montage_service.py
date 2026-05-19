"""
Montage service.
Composites N captured photos onto a template background image
according to the cadres (frame positions) defined in the template JSON.

Rendering modes (template JSON field "mode"):
  "classic"  (default) – template image is the background; photos drawn on top.
  "overlay"            – photos drawn on a blank canvas first; template image
                         (must have an alpha channel) is then composited on top
                         so its decorative elements (frames, borders…) appear
                         in front of the photos.

Optional JSON field "couleur_fond" (overlay mode only):
  [R, G, B] tuple for the canvas background colour. Defaults to white [255,255,255].
"""

import json
from pathlib import Path

from PIL import Image

from constants import EXPORTS_DIR, STATIC_DIR, TEMPLATES_DIR
from services.config_service import get as get_config
from utils.image_utils import convert_to_rgb, resize_and_crop
from utils.path_utils import ensure_dir, timestamped_filename


def _load_template(template_name: str) -> dict:
    """Read and return a template definition from its JSON file."""
    json_path = TEMPLATES_DIR / f"{template_name}.json"
    if not json_path.exists():
        raise FileNotFoundError(f"Template not found: {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def _load_template_image(template: dict) -> Image.Image:
    """Open and return the template image (background or overlay) as RGBA."""
    bg_path = TEMPLATES_DIR / template["image_fond"]
    if not bg_path.exists():
        raise FileNotFoundError(f"Template image not found: {bg_path}")
    return Image.open(bg_path).convert("RGBA")


def _paste_photo(canvas: Image.Image, photo_path: Path, cadre: dict) -> None:
    """
    Open, resize/crop, and paste a single photo onto the canvas at cadre position.
    Mutates canvas in place.
    """
    photo = Image.open(photo_path).convert("RGBA")
    photo = resize_and_crop(photo, cadre["width"], cadre["height"])
    canvas.paste(photo, (cadre["x"], cadre["y"]))


def generate_montage(photo_paths: list[str]) -> str:
    """
    Build a montage from a list of photo paths (relative to STATIC_DIR).

    Returns the URL-friendly path relative to STATIC_DIR
    (e.g. "exports/session_20240101_120000.png").
    """
    template_name = get_config("template", "default")
    template = _load_template(template_name)
    template_image = _load_template_image(template)

    overlay_mode = template.get("mode", "classic") == "overlay"

    if overlay_mode:
        # Blank canvas (white by default) → photos → template as overlay
        bg_rgb = tuple(template.get("couleur_fond", [255, 255, 255]))
        canvas = Image.new("RGBA", template_image.size, bg_rgb + (255,))
    else:
        # Classic: template image is the background
        canvas = template_image.copy()

    cadres = template.get("cadres", [])
    if len(photo_paths) < len(cadres):
        raise ValueError(
            f"Template '{template_name}' requires {len(cadres)} photos, "
            f"but only {len(photo_paths)} were provided."
        )

    for cadre, rel_path in zip(cadres, photo_paths):
        photo_path = STATIC_DIR / rel_path
        _paste_photo(canvas, photo_path, cadre)

    if overlay_mode:
        # Composite the template (with its transparent cut-outs) on top of photos
        canvas.alpha_composite(template_image)

    # Flatten RGBA → RGB before saving as PNG
    final = canvas.convert("RGB")

    ensure_dir(EXPORTS_DIR)
    filename = timestamped_filename("session", "png")
    output_path = EXPORTS_DIR / filename
    final.save(output_path, "PNG", optimize=False)

    return f"exports/{filename}"
