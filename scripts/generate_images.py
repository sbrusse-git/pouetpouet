#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import time
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "images"
ENV_PATH = ROOT / ".env"
QUEUE_URL = "https://queue.fal.run/fal-ai/nano-banana-2"

PROMPTS = {
    "hero": {
        "size": (1600, 900),
        "prompt": (
            "Belgian foodtruck catering trailer at dusk in a courtyard, real towable trailer with open barbecue station, "
            "not a van, warm string lights and cosy event lighting around it, adults gathering with drinks and relaxed smiles, "
            "chef team serving grilled food, chic but approachable atmosphere, cinematic warm smoke and embers, premium event photography, "
            "wide composition with space for website headline, no visible text, no logos, no watermarks"
        ),
    },
    "concept": {
        "size": (1200, 1500),
        "prompt": (
            "Four passionate cooks around a stylish catering trailer preparing a live barbecue service, real mobile trailer setup, "
            "not a converted van, candid teamwork, stainless grill, trays of fresh ingredients, warm natural light, documentary editorial food photography, "
            "friendly energy, premium but human, no visible text, no logos, no watermarks"
        ),
    },
    "lunch": {
        "size": (1200, 900),
        "prompt": (
            "Corporate lunch event in Belgium with a compact barbecue catering trailer parked in a modern office courtyard, "
            "employees in smart casual clothes eating outdoors, daylight, efficient service, premium foodtruck trailer setup, "
            "clean and inviting atmosphere, no visible text, no logos, no watermarks"
        ),
    },
    "birthday": {
        "size": (1200, 900),
        "prompt": (
            "Adult birthday garden party at golden hour with a barbecue trailer serving guests, cosy string lights overhead, "
            "warm flames and smoke, long tables, glasses raised, stylish but relaxed mood, unmistakably a towable food trailer not a van, "
            "beautiful evening event photography, no visible text, no logos, no watermarks"
        ),
    },
    "grill": {
        "size": (1400, 900),
        "prompt": (
            "Close-up plated hotdog served from a premium catering trailer, deep blue ceramic plate, toasted brioche bun, "
            "grilled sausage, generous yellow mustard drizzle, glossy relish or chutney, finely chopped red onion, one hand presenting the plate, "
            "shallow depth of field, warm street food trailer lighting, editorial food photography inspired by a candid event snapshot, "
            "mouth-watering texture, no visible text, no logos, no watermarks"
        ),
    },
    "setup": {
        "size": (1200, 900),
        "prompt": (
            "Wide evening scene of a stylish catering trailer set up for an afterwork event, guinguette string lights, standing tables, "
            "soft smoke from barbecue, elegant crowd of adults, premium hospitality atmosphere, clearly a trailer with barbecue station, "
            "not a van, no visible text, no logos, no watermarks"
        ),
    },
}


def load_fal_key() -> str:
    if os.environ.get("FAL_KEY"):
        return os.environ["FAL_KEY"]
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text().splitlines():
            if line.startswith("FAL_KEY="):
                return line.split("=", 1)[1].strip()
    raise RuntimeError("FAL_KEY not found in environment or .env")


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


def generate_image(name: str, config: dict, key: str) -> dict:
    width, height = config["size"]
    submit = fal_request(
        "POST",
        QUEUE_URL,
        key,
        {
            "prompt": config["prompt"],
            "image_size": {"width": width, "height": height},
        },
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
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    key = load_fal_key()
    manifest = {}

    for name, config in PROMPTS.items():
        print(f"Generating {name}...")
        manifest[name] = generate_image(name, config, key)

    (OUTPUT_DIR / "image-manifest.json").write_text(json.dumps(manifest, indent=2))
    print("Done.")


if __name__ == "__main__":
    main()
