#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import time
import urllib.request
from pathlib import Path

import boto3
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "images"
ENV_PATH = ROOT / ".env"
SIBLING_ENV_PATH = ROOT.parent / "wedesignyoursite" / ".env"
QUEUE_URL = "https://queue.fal.run/fal-ai/nano-banana-2"
EDIT_QUEUE_URL = "https://queue.fal.run/fal-ai/nano-banana-2/edit"
REFERENCE_PREFIX = "pouetpouet/reference"
LOGO_DECAL_PATH = ROOT / "public" / "brand" / "logo-dark.png"
REFERENCE_SOURCES = {
    "team": ROOT / "assets" / "source" / "image_ppl.jpg",
    "trailer": ROOT / "assets" / "source" / "image_trailer.jpg",
}

ASPECT_RATIOS = {
    (1600, 900): "16:9",
    (1200, 900): "4:3",
    (1200, 1500): "4:5",
}

LOGO_PLACEMENTS = {
    "hero": [
        [(576, 486), (806, 486), (802, 540), (578, 541)],
    ],
    "concept": [
        [(162, 846), (430, 878), (425, 925), (160, 898)],
    ],
    "lunch": [
        [(490, 630), (744, 642), (739, 687), (489, 676)],
    ],
    "birthday": [
        [(371, 607), (619, 607), (615, 655), (371, 655)],
    ],
    "setup": [
        [(458, 573), (691, 573), (686, 621), (458, 622)],
    ],
}

PROMPTS = {
    "hero": {
        "size": (1600, 900),
        "mode": "edit",
        "references": ["team", "trailer"],
        "prompt": (
            "Use the uploaded reference images as hard reference for the exact four real Pouet Pouet team members and the exact compact trailer-cart. "
            "Keep the trailer-cart the same size and proportions as in the references: a compact waist-high single-axle barbecue cart that can be pushed by hand, "
            "with a flat-top griddle and blue-and-red metal body, not a large food truck, not a catering trailer and not a van. "
            "Stage the same four people at dusk in a beautiful Belgian courtyard with warm string lights, elegant guests, smoke from the grill and a premium event atmosphere. "
            "All four team members must be visible, recognizable and central. No extra staff. No readable text or logos on the trailer."
        ),
    },
    "concept": {
        "size": (1200, 1500),
        "mode": "edit",
        "references": ["team", "trailer"],
        "prompt": (
            "Use the uploaded reference images as hard reference for the exact same four real Pouet Pouet team members and the exact compact trailer-cart. "
            "Create a warm documentary-style portrait of the four people around the small trailer during service prep, smiling, cooking and plating together. "
            "Keep the real scale and design from the references: a small single-axle blue-and-red barbecue cart with a flat-top griddle, compact enough to push by hand. "
            "Natural light, candid teamwork, premium but human, all four people clearly visible, no extra staff, no readable text or logos."
        ),
    },
    "lunch": {
        "size": (1200, 900),
        "mode": "edit",
        "references": ["team", "trailer"],
        "prompt": (
            "Use the uploaded reference images as hard reference for the exact same four real Pouet Pouet team members and the exact compact trailer-cart. "
            "Create a Belgian corporate lunch scene in daylight with the small trailer set in a modern office courtyard. "
            "The same four people are serving and cooking for employees in smart casual clothes. Keep the cart exactly in the spirit of the references: a small single-axle blue-and-red metal barbecue cart with a flat-top griddle, "
            "modest and realistic, not a full-size truck and not a large trailer. All four team members must appear in the scene. No readable text or logos."
        ),
    },
    "birthday": {
        "size": (1200, 900),
        "mode": "edit",
        "references": ["team", "trailer"],
        "prompt": (
            "Use the uploaded reference images as hard reference for the exact same four real Pouet Pouet team members and the exact compact trailer-cart. "
            "Create an adult birthday garden party at golden hour with cosy string lights, warm flames, long wooden tables and the same four people serving from the small trailer. "
            "Keep the trailer exactly like the reference cart: a tiny single-axle blue-and-red barbecue cart with a flat-top griddle, low to the ground and much smaller than a normal trailer. "
            "Stylish, warm, relaxed, all four team members visible, no extra staff, no readable text or logos."
        ),
    },
    "grill": {
        "size": (1400, 900),
        "mode": "generate",
        "prompt": (
            "Close-up plated hotdog served from a premium catering trailer, deep blue ceramic plate, toasted brioche bun, "
            "grilled sausage, generous yellow mustard drizzle, glossy relish or chutney, finely chopped red onion, one hand presenting the plate, "
            "shallow depth of field, warm street food trailer lighting, editorial food photography inspired by a candid event snapshot, "
            "mouth-watering texture, no visible text, no logos, no watermarks"
        ),
    },
    "setup": {
        "size": (1200, 900),
        "mode": "edit",
        "references": ["team", "trailer"],
        "prompt": (
            "Use the uploaded reference images as hard reference for the exact same four real Pouet Pouet team members and the exact compact trailer-cart. "
            "Create a wide evening afterwork scene with the small trailer set up under guinguette lights, barbecue smoke, standing tables and a premium crowd. "
            "The same four people should be visible around the trailer in service. Keep the cart exactly like the references: a tiny single-axle blue-and-red barbecue cart with a flat-top griddle, "
            "compact and realistic, not a large trailer and not a van. "
            "No readable text or logos."
        ),
    },
}


def gaussian_elimination(matrix: list[list[float]], values: list[float]) -> list[float]:
    size = len(values)
    augmented = [row[:] + [values[index]] for index, row in enumerate(matrix)]

    for pivot_index in range(size):
        pivot_row = max(range(pivot_index, size), key=lambda row: abs(augmented[row][pivot_index]))
        if abs(augmented[pivot_row][pivot_index]) < 1e-12:
            raise RuntimeError("Unable to solve perspective transform")
        augmented[pivot_index], augmented[pivot_row] = augmented[pivot_row], augmented[pivot_index]

        pivot = augmented[pivot_index][pivot_index]
        for column in range(pivot_index, size + 1):
            augmented[pivot_index][column] /= pivot

        for row in range(size):
            if row == pivot_index:
                continue
            factor = augmented[row][pivot_index]
            if factor == 0:
                continue
            for column in range(pivot_index, size + 1):
                augmented[row][column] -= factor * augmented[pivot_index][column]

    return [augmented[index][size] for index in range(size)]


def perspective_coefficients(destination_points: list[tuple[int, int]], source_points: list[tuple[int, int]]) -> list[float]:
    matrix: list[list[float]] = []
    values: list[float] = []

    for (dest_x, dest_y), (src_x, src_y) in zip(destination_points, source_points):
        matrix.append([dest_x, dest_y, 1, 0, 0, 0, -src_x * dest_x, -src_x * dest_y])
        values.append(src_x)
        matrix.append([0, 0, 0, dest_x, dest_y, 1, -src_y * dest_x, -src_y * dest_y])
        values.append(src_y)

    return gaussian_elimination(matrix, values)


def build_logo_decal() -> Image.Image:
    with Image.open(LOGO_DECAL_PATH).convert("RGBA") as logo:
        pad_x = max(36, logo.width // 12)
        pad_y = max(20, logo.height // 4)
        decal = Image.new("RGBA", (logo.width + pad_x * 2, logo.height + pad_y * 2), (252, 247, 239, 238))
        decal.paste(logo, (pad_x, pad_y), logo)
        border = max(2, decal.height // 28)
        ImageDraw.Draw(decal).rectangle(
            (border // 2, border // 2, decal.width - 1 - border // 2, decal.height - 1 - border // 2),
            outline=(32, 24, 20, 165),
            width=border,
        )
        return decal


def apply_logo_decals(image_path: Path, target_name: str) -> None:
    placements = LOGO_PLACEMENTS.get(target_name, [])
    if not placements:
        return

    with Image.open(image_path).convert("RGBA") as base:
        for placement in placements:
            decal = build_logo_decal()
            source = [
                (0, 0),
                (decal.width - 1, 0),
                (decal.width - 1, decal.height - 1),
                (0, decal.height - 1),
            ]
            coeffs = perspective_coefficients(placement, source)
            warped = decal.transform(
                base.size,
                Image.PERSPECTIVE,
                coeffs,
                Image.BICUBIC,
                fillcolor=(0, 0, 0, 0),
            )
            base.alpha_composite(warped)

        base.convert("RGB").save(image_path, "WEBP", quality=92, method=6)


def build_manifest_entry(name: str, config: dict) -> dict:
    width, height = config["size"]
    entry = {
        "file": str((OUTPUT_DIR / f"{name}.webp").relative_to(ROOT)),
        "prompt": config["prompt"],
        "size": {"width": width, "height": height},
    }
    if config.get("mode"):
        entry["mode"] = config["mode"]
    if config.get("references"):
        entry["references"] = config["references"]
    if name in LOGO_PLACEMENTS:
        entry["logo_decal"] = str(LOGO_DECAL_PATH.relative_to(ROOT))
    return entry


def load_env_value(key: str, *paths: Path) -> str:
    if os.environ.get(key):
        return os.environ[key]
    for path in paths:
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip()
    raise RuntimeError(f"{key} not found in environment or env files")


def load_fal_key() -> str:
    return load_env_value("FAL_KEY", ENV_PATH)


def r2_client():
    return boto3.client(
        "s3",
        endpoint_url=load_env_value("R2_ENDPOINT", SIBLING_ENV_PATH),
        aws_access_key_id=load_env_value("R2_ACCESS_KEY_ID", SIBLING_ENV_PATH),
        aws_secret_access_key=load_env_value("R2_SECRET_ACCESS_KEY", SIBLING_ENV_PATH),
        region_name="auto",
    )


def bucket_name() -> str:
    return load_env_value("R2_BUCKET", SIBLING_ENV_PATH)


def fal_request(method: str, url: str, key: str, payload: dict | None = None) -> dict:
    headers = {
        "Authorization": f"Key {key}",
        "Content-Type": "application/json",
    }
    body = json.dumps(payload).encode("utf-8") if payload else None
    request = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=300) as response:
        return json.loads(response.read().decode("utf-8"))


def download_to_webp(url: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = output_path.with_suffix(".tmp")
    with urllib.request.urlopen(url, timeout=180) as response:
        tmp_path.write_bytes(response.read())
    with Image.open(tmp_path) as image:
        image.save(output_path, "WEBP", quality=92, method=6)
    tmp_path.unlink(missing_ok=True)


def upload_reference_images() -> dict[str, str]:
    client = r2_client()
    bucket = bucket_name()
    urls: dict[str, str] = {}

    for name, source_path in REFERENCE_SOURCES.items():
        if not source_path.exists():
            raise RuntimeError(f"Missing reference source: {source_path}")
        object_key = f"{REFERENCE_PREFIX}/{source_path.name}"
        client.put_object(
            Bucket=bucket,
            Key=object_key,
            Body=source_path.read_bytes(),
            ContentType="image/jpeg",
            CacheControl="public, max-age=31536000",
        )
        urls[name] = f"https://r2.wedesignyour.site/{object_key}"

    return urls


def build_payload(config: dict, reference_urls: dict[str, str]) -> tuple[str, dict]:
    width, height = config["size"]
    if config.get("mode") == "edit":
        image_urls = [reference_urls[name] for name in config["references"]]
        aspect_ratio = ASPECT_RATIOS.get((width, height), "auto")
        return EDIT_QUEUE_URL, {
            "prompt": config["prompt"],
            "image_urls": image_urls,
            "aspect_ratio": aspect_ratio,
            "output_format": "png",
            "num_images": 1,
            "limit_generations": True,
        }
    return QUEUE_URL, {
        "prompt": config["prompt"],
        "image_size": {"width": width, "height": height},
    }


def generate_image(name: str, config: dict, key: str, reference_urls: dict[str, str]) -> dict:
    queue_url, payload = build_payload(config, reference_urls)
    submit = fal_request(
        "POST",
        queue_url,
        key,
        payload,
    )

    status_url = submit["status_url"]
    response_url = submit["response_url"]
    while True:
        time.sleep(1)
        status = fal_request("GET", status_url, key)
        state = status.get("status")
        if state == "COMPLETED":
            break
        if state in {"FAILED", "CANCELLED"}:
            raise RuntimeError(f"{name} failed: {status}")

    result = fal_request("GET", response_url, key)
    images = result.get("images", [])
    if not images:
        raise RuntimeError(f"{name} returned no images")

    output_path = OUTPUT_DIR / f"{name}.webp"
    download_to_webp(images[0]["url"], output_path)
    apply_logo_decals(output_path, name)
    return build_manifest_entry(name, config)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--logos-only", action="store_true", help="Apply the logo decal to existing images without regenerating them.")
    parser.add_argument("targets", nargs="*", help="Image ids to generate. Default: all.")
    return parser.parse_args()


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    args = parse_args()
    targets = args.targets or list(PROMPTS.keys())
    unknown = [target for target in targets if target not in PROMPTS]
    if unknown:
        raise RuntimeError(f"Unknown targets: {', '.join(unknown)}")

    manifest_path = OUTPUT_DIR / "image-manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

    if args.logos_only:
        for name in targets:
            output_path = OUTPUT_DIR / f"{name}.webp"
            if not output_path.exists():
                raise RuntimeError(f"Missing generated image: {output_path}")
            print(f"Branding {name}...")
            apply_logo_decals(output_path, name)
            manifest[name] = build_manifest_entry(name, PROMPTS[name])

        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
        print("Done.")
        return

    key = load_fal_key()
    reference_urls = upload_reference_images()
    manifest["_references"] = reference_urls

    for name in targets:
        config = PROMPTS[name]
        print(f"Generating {name}...")
        manifest[name] = generate_image(name, config, key, reference_urls)

    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print("Done.")


if __name__ == "__main__":
    main()
