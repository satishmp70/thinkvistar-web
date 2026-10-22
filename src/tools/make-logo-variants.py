#!/usr/bin/env python3
"""Generates the smaller responsive logo variants from the 480px master WebP files.

    python3 src/tools/make-logo-variants.py

Masters (committed, never overwritten): static/images/logo/thinkvistar-logo.webp and
thinkvistar-logo-light.webp. Output: <name>-240.webp and <name>-360.webp next to them.
Needs Pillow. The variants are committed, so CI does not need to run this.
"""
from pathlib import Path
from PIL import Image

LOGO_DIR = Path(__file__).resolve().parents[2] / "static" / "images" / "logo"
WIDTHS = (240, 360)

for master in ("thinkvistar-logo", "thinkvistar-logo-light"):
    source = Image.open(LOGO_DIR / f"{master}.webp")
    for width in WIDTHS:
        height = round(source.height * width / source.width)
        out = LOGO_DIR / f"{master}-{width}.webp"
        source.resize((width, height), Image.LANCZOS).save(out, "WEBP", quality=90, method=6)
        print(f"{out.name}: {width}x{height}, {out.stat().st_size} bytes")
