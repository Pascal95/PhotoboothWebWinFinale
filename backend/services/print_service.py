"""
Print service for Windows.
Sends a photo to the DNP DS620 (or any Windows-registered printer)
using win32print + PIL ImageWin for pixel-perfect photo printing.
"""

from pathlib import Path

from PIL import Image

from services.config_service import get as get_config

try:
    import win32print
    import win32ui
    from PIL import ImageWin
    WIN32_AVAILABLE = True
except ImportError:
    WIN32_AVAILABLE = False


def _print_with_win32(image_path: Path, printer_name: str, copies: int) -> None:
    """
    Send an image to a Windows printer using GDI (win32print + ImageWin).
    Scales the image to fill the printable area without distortion.
    """
    img = Image.open(image_path).convert("RGB")

    hDC = win32ui.CreateDC()
    hDC.CreatePrinterDC(printer_name)
    hDC.StartDoc(image_path.name)

    try:
        for _ in range(copies):
            hDC.StartPage()

            printer_w = hDC.GetDeviceCaps(110)  # HORZRES: printable width in px
            printer_h = hDC.GetDeviceCaps(111)  # VERTRES: printable height in px

            # Scale image to fit the printable area preserving aspect ratio
            img_ratio = img.width / img.height
            printer_ratio = printer_w / printer_h

            if img_ratio > printer_ratio:
                dest_w = printer_w
                dest_h = int(printer_w / img_ratio)
            else:
                dest_h = printer_h
                dest_w = int(printer_h * img_ratio)

            offset_x = (printer_w - dest_w) // 2
            offset_y = (printer_h - dest_h) // 2

            dib = ImageWin.Dib(img)
            dib.draw(
                hDC.GetHandleOutput(),
                (offset_x, offset_y, offset_x + dest_w, offset_y + dest_h),
            )
            hDC.EndPage()
    finally:
        hDC.EndDoc()
        hDC.DeleteDC()


def _print_fallback(image_path: Path, printer_name: str) -> None:
    """
    Fallback printer using PowerShell (no pywin32 required).
    Less precise but functional for development/testing.
    """
    import subprocess

    ps_cmd = (
        f'$p=New-Object -ComObject WScript.Shell;'
        f'$p.Run(\'rundll32 shimgvw.dll,ImageView_PrintTo '
        f'"{image_path}" "{printer_name}"\', 0, $true)'
    )
    subprocess.run(["powershell", "-Command", ps_cmd], check=True)


def print_photo(image_path: Path, copies: int | None = None) -> None:
    """
    Print a photo to the configured printer.

    Args:
        image_path: Absolute path to the image file.
        copies:     Number of copies. Falls back to config value if None.

    Raises:
        FileNotFoundError: If the image does not exist.
        RuntimeError:      If printing fails.
    """
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    printer_name = get_config("printer_name", "DNP DS620")
    if copies is None:
        copies = int(get_config("nombre_impressions", 1))

    if WIN32_AVAILABLE:
        _print_with_win32(image_path, printer_name, copies)
    else:
        # pywin32 not installed — use PowerShell fallback
        _print_fallback(image_path, printer_name)


def list_printers() -> list[str]:
    """Return all printer names registered with Windows."""
    if not WIN32_AVAILABLE:
        return []
    flags = win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS
    return [p[2] for p in win32print.EnumPrinters(flags)]
