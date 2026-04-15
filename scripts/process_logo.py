#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source" / "logo-sheet.jpg"
BRAND_DIR = ROOT / "public" / "brand"
APP_DIR = ROOT / "app"


def make_transparent(image: Image.Image, background: Iterable[int], threshold: int) -> Image.Image:
    image = image.convert("RGBA")
    bg = tuple(background)
    pixels = []
    for r, g, b, a in image.getdata():
        distance = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
        alpha = 0 if distance <= threshold else a
        pixels.append((r, g, b, alpha))
    image.putdata(pixels)
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def save_logo_variants() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    APP_DIR.mkdir(parents=True, exist_ok=True)

    source = Image.open(SOURCE).convert("RGB")
    width, height = source.size
    top_crop = source.crop((135, 105, width - 135, 700))
    bottom_crop = source.crop((135, 900, width - 135, height - 110))

    dark_logo = make_transparent(top_crop, background=(255, 255, 255), threshold=42)
    light_logo = make_transparent(bottom_crop, background=(61, 46, 41), threshold=38)

    dark_logo.save(BRAND_DIR / "logo-dark.png")
    light_logo.save(BRAND_DIR / "logo-light.png")

    flame = dark_logo.crop(
        (
            max(0, dark_logo.width // 2 - 118),
            max(0, dark_logo.height // 2 - 90),
            min(dark_logo.width, dark_logo.width // 2 + 118),
            min(dark_logo.height, dark_logo.height // 2 + 130),
        )
    )
    flame = flame.crop(flame.getbbox() or (0, 0, flame.width, flame.height))
    flame.save(BRAND_DIR / "flame.png")

    icon = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    flame_fit = flame.copy()
    flame_fit.thumbnail((320, 320))
    x = (icon.width - flame_fit.width) // 2
    y = (icon.height - flame_fit.height) // 2
    icon.alpha_composite(flame_fit, (x, y))
    icon.save(APP_DIR / "icon.png")


if __name__ == "__main__":
    save_logo_variants()
