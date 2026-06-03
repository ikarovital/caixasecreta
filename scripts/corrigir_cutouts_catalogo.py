# -*- coding: utf-8 -*-
"""
Corrige imagens _cutout.png do catálogo PDF (fundo escuro + recortes ruins).

- Recortes com pouco conteúdo visível → volta para o JPEG original no JSON.
- Recortes bons → composita em fundo branco + nitidez leve (como importados).

Uso:
  python scripts/corrigir_cutouts_catalogo.py --slug calcinhas
  python scripts/corrigir_cutouts_catalogo.py
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

BASE = Path(__file__).resolve().parents[1]
CATALOG_JSON = BASE / "frontend" / "src" / "data" / "catalogo-lingerie.json"
EXTRACAO_ROOT = BASE / "dados" / "extracao_pdf"

DEFAULT_SLUGS = ("calcinhas", "conjuntos", "espartilhos", "fantasias")
MIN_CONTENT_PX = 520
MIN_FILL_RATIO = 0.22
MIN_GRAY_STD = 35.0
JPEG_STD_RATIO = 0.9


def gray_std(path: Path) -> float:
    with Image.open(path) as im:
        rgb = np.array(im.convert("RGB"), dtype=np.float32)
    gray = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    return float(gray.std())


def cutout_is_washed_out(cutout: Path, jpeg: Path | None) -> bool:
    try:
        c_std = gray_std(cutout)
    except OSError:
        return True
    if c_std < MIN_GRAY_STD:
        return True
    if jpeg and jpeg.exists():
        try:
            j_std = gray_std(jpeg)
            if c_std < j_std * JPEG_STD_RATIO:
                return True
        except OSError:
            pass
    return False


def to_disk_path(image_url: str) -> Path | None:
    if not image_url or not image_url.startswith("/extracao_pdf/"):
        return None
    rel = image_url[len("/extracao_pdf/") :].lstrip("/").replace("/", os.sep)
    p = EXTRACAO_ROOT / rel
    return p if p.exists() else None


def source_jpeg_for(cutout: Path) -> Path | None:
    stem = cutout.stem.replace("_cutout", "")
    for ext in (".jpeg", ".jpg", ".webp"):
        candidate = cutout.with_name(stem + ext)
        if candidate.exists():
            return candidate
    for p in sorted(cutout.parent.glob(f"{stem}.*")):
        if p.suffix.lower() in (".jpeg", ".jpg", ".webp") and "_cutout" not in p.stem:
            return p
    return None


def content_stats(path: Path) -> tuple[int, float]:
    with Image.open(path) as im:
        im = im.convert("RGBA")
        w, h = im.size
        alpha = np.array(im)[:, :, 3]
        ys, xs = np.where(alpha > 30)
        if len(xs) == 0:
            return 0, 0.0
        cw = int(xs.max() - xs.min() + 1)
        ch = int(ys.max() - ys.min() + 1)
        fill = (cw * ch) / (w * h)
        return min(cw, ch), float(fill)


def composite_white_png(path: Path) -> bool:
    try:
        im = Image.open(path).convert("RGBA")
    except OSError:
        return False

    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    out = bg.convert("RGB")
    out = ImageEnhance.Contrast(out).enhance(1.05)
    out = ImageEnhance.Sharpness(out).enhance(1.1)

    tmp = path.with_suffix(".tmp.png")
    out.save(tmp, format="PNG", optimize=True)
    for _ in range(6):
        try:
            tmp.replace(path)
            return True
        except PermissionError:
            import time

            time.sleep(0.35)
    try:
        tmp.unlink(missing_ok=True)
    except OSError:
        pass
    return False


def url_for_path(path: Path) -> str:
    rel = path.relative_to(EXTRACAO_ROOT).as_posix()
    return f"/extracao_pdf/{rel}"


def main() -> None:
    ap = argparse.ArgumentParser(description="Corrigir cutouts do catálogo PDF")
    ap.add_argument("--slug", action="append", help="Categoria (pode repetir). Padrão: calcinhas, conjuntos, …")
    ap.add_argument("--min-px", type=int, default=MIN_CONTENT_PX, help="Mínimo do lado útil do recorte")
    ap.add_argument(
        "--force-jpeg",
        action="store_true",
        help="Volta todo cutout da categoria para o JPEG (sem recorte)",
    )
    args = ap.parse_args()

    slugs = set(args.slug) if args.slug else set(DEFAULT_SLUGS)
    items = json.loads(CATALOG_JSON.read_text(encoding="utf-8"))

    reverted = 0
    fixed_png = 0
    skipped = 0

    for p in items:
        if p.get("categorySlug") not in slugs:
            continue
        img = p.get("image") or ""
        if "_cutout" not in img:
            continue

        cutout = to_disk_path(img)
        if not cutout:
            skipped += 1
            continue

        cmin, fill = content_stats(cutout)
        jpeg = source_jpeg_for(cutout)

        if args.force_jpeg or cutout_is_washed_out(cutout, jpeg):
            if jpeg:
                p["image"] = url_for_path(jpeg)
                reverted += 1
            else:
                skipped += 1
            continue

        if cmin < args.min_px or fill < MIN_FILL_RATIO:
            if jpeg:
                p["image"] = url_for_path(jpeg)
                reverted += 1
            else:
                skipped += 1
            continue

        if composite_white_png(cutout):
            p["image"] = url_for_path(cutout)
            fixed_png += 1
        else:
            skipped += 1

    CATALOG_JSON.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Concluído ({', '.join(sorted(slugs))}): "
        f"{reverted} voltaram ao JPEG · {fixed_png} cutouts com fundo branco · {skipped} ignorados"
    )


if __name__ == "__main__":
    main()
