#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import time
import urllib.request
from pathlib import Path

import boto3
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "images"
ENV_PATH = ROOT / ".env"
SIBLING_ENV_PATH = ROOT.parent / "wedesignyoursite" / ".env"
QUEUE_URL = "https://queue.fal.run/fal-ai/nano-banana-2"
EDIT_QUEUE_URL = "https://queue.fal.run/fal-ai/nano-banana-2/edit"
REFERENCE_PREFIX = "pouetpouet/reference"
REFERENCE_SOURCES = {
    "team": ROOT / "assets" / "source" / "image_ppl.jpg",
    "trailer": ROOT / "assets" / "source" / "image_trailer.jpg",
}

ASPECT_RATIOS = {
    (1600, 900): "16:9",
    (1200, 900): "4:3",
    (1200, 1500): "4:5",
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
    width, height = config["size"]
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
    return {
        "file": str(output_path.relative_to(ROOT)),
        "prompt": config["prompt"],
        "size": {"width": width, "height": height},
        "mode": config.get("mode", "generate"),
        "references": config.get("references", []),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("targets", nargs="*", help="Image ids to generate. Default: all.")
    return parser.parse_args()


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    args = parse_args()
    key = load_fal_key()
    reference_urls = upload_reference_images()
    targets = args.targets or list(PROMPTS.keys())
    unknown = [target for target in targets if target not in PROMPTS]
    if unknown:
        raise RuntimeError(f"Unknown targets: {', '.join(unknown)}")

    manifest_path = OUTPUT_DIR / "image-manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    manifest["_references"] = reference_urls

    for name in targets:
        config = PROMPTS[name]
        print(f"Generating {name}...")
        manifest[name] = generate_image(name, config, key, reference_urls)

    manifest_path.write_text(json.dumps(manifest, indent=2))
    print("Done.")


if __name__ == "__main__":
    main()
