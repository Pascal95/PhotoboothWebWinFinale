"""
Image processing utilities.
Pure functions — no side effects, no I/O.
"""

from PIL import Image


def resize_and_crop(image: Image.Image, target_width: int, target_height: int) -> Image.Image:
    """
    Resize an image to cover target dimensions exactly, then center-crop.
    Maintains aspect ratio during resize — no distortion.
    """
    src_ratio = image.width / image.height
    target_ratio = target_width / target_height

    if src_ratio > target_ratio:
        # Image is wider than target: scale by height
        new_height = target_height
        new_width = int(src_ratio * new_height)
    else:
        # Image is taller than target: scale by width
        new_width = target_width
        new_height = int(new_width / src_ratio)

    resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    left = (new_width - target_width) // 2
    top = (new_height - target_height) // 2
    return resized.crop((left, top, left + target_width, top + target_height))


def convert_to_rgb(image: Image.Image) -> Image.Image:
    """Ensure the image is in RGB mode (required before JPEG save)."""
    if image.mode != "RGB":
        return image.convert("RGB")
    return image


def fit_image_on_canvas(
    image: Image.Image,
    canvas_width: int,
    canvas_height: int,
    background_color: tuple = (255, 255, 255),
) -> Image.Image:
    """
    Fit an image inside a canvas without cropping.
    Adds letterboxing/pillarboxing with background_color if aspect ratios differ.
    """
    image.thumbnail((canvas_width, canvas_height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (canvas_width, canvas_height), background_color)
    offset_x = (canvas_width - image.width) // 2
    offset_y = (canvas_height - image.height) // 2
    canvas.paste(image, (offset_x, offset_y))
    return canvas
