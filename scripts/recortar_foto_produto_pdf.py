# -*- coding: utf-8 -*-
"""
Gera versão limpa da foto de produto a partir das imagens extraídas do PDF.

- Prefere miniaturas (img3) quando existem
- Remove faixas do catálogo (texto/colagens) via recorte por contraste
- Salva `{nome}_foto.jpeg` na pasta do produto

Uso:
  python scripts/recortar_foto_produto_pdf.py --slug calcinhas
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

BASE = Path(__file__).resolve().parents[1]
EXTRACAO = BASE / "dados" / "extracao_pdf"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def list_sources(folder: Path) -> list[Path]:
    files = []
    for p in folder.iterdir():
        if not p.is_file() or p.suffix.lower() not in IMAGE_EXTS:
            continue
        if p.suffix.lower() == ".png" and ("cutout" in p.stem.lower() or p.stat().st_size < 25_000):
            continue
        if p.stem.endswith("_foto"):
            continue
        files.append(p)
    return sorted(files, key=lambda x: (x.stat().st_size, x.name))


def gray_std(rgb: np.ndarray) -> float:
    g = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    return float(g.std())


def white_ratio(rgb: np.ndarray) -> float:
    return float(((rgb[:, :, 0] > 235) & (rgb[:, :, 1] > 235) & (rgb[:, :, 2] > 235)).mean())


def score_source(path: Path) -> float:
    try:
        with Image.open(path) as im:
            im = im.convert("RGB")
            w, h = im.size
            if min(w, h) < 200:
                return -1.0
            rgb = np.array(im.resize((min(400, w), int(h * min(400, w) / w))), dtype=np.float32)
    except OSError:
        return -1.0

    area = w * h
    std = gray_std(rgb)
    ar = w / h
    s = std * 2.2
    if 0.48 <= ar <= 0.92:
        s *= 1.8
    if 80_000 <= area <= 550_000:
        s *= 2.4
    if area > 1_200_000:
        s *= 0.08
    elif area > 750_000:
        s *= 0.25
    if re.search(r"_img3\.(jpe?g|png|webp)$", path.name, re.I):
        s *= 3.5
    if re.search(r"_img2\.(jpe?g|png|webp)$", path.name, re.I):
        s *= 1.4
    if re.search(r"_img1\.(jpe?g|png|webp)$", path.name, re.I):
        s *= 0.55
    if std < 22:
        s *= 0.3
    return s


def pick_best_source(folder: Path) -> Path | None:
    ranked = [(score_source(p), p) for p in list_sources(folder)]
    ranked = [(s, p) for s, p in ranked if s > 0]
    if not ranked:
        return None
    return max(ranked, key=lambda x: x[0])[1]


def find_crop_box(rgb: np.ndarray) -> tuple[int, int, int, int] | None:
    h, w = rgb.shape[:2]
    scale = min(1.0, 480 / max(w, h))
    sw, sh = max(1, int(w * scale)), max(1, int(h * scale))
    small = np.array(
        Image.fromarray(rgb.astype(np.uint8)).resize((sw, sh), Image.Resampling.BILINEAR),
        dtype=np.float32,
    )
    g = 0.299 * small[:, :, 0] + 0.587 * small[:, :, 1] + 0.114 * small[:, :, 2]

    best_score = 0.0
    best_box = None
    win_heights = [int(sh * f) for f in (0.45, 0.55, 0.65, 0.75, 0.85, 0.95)]
    win_widths = [sw, int(sw * 0.72), int(sw * 0.58)]

    for wh in win_heights:
        if wh < 40:
            continue
        for ww in win_widths:
            if ww < 40:
                continue
            step_y = max(8, wh // 8)
            step_x = max(8, ww // 6)
            for y0 in range(0, max(1, sh - wh), step_y):
                for x0 in range(0, max(1, sw - ww), step_x):
                    patch = g[y0 : y0 + wh, x0 : x0 + ww]
                    wr = white_ratio(small[y0 : y0 + wh, x0 : x0 + ww])
                    sc = float(patch.std()) * (1.0 - min(wr, 0.85))
                    ar = ww / wh
                    if 0.45 <= ar <= 1.05:
                        sc *= 1.25
                    if sc > best_score:
                        best_score = sc
                        best_box = (x0, y0, x0 + ww, y0 + wh)

    if not best_box or best_score < 8:
        return None

    inv = 1.0 / scale
    x0, y0, x1, y1 = best_box
    pad_x = int((x1 - x0) * 0.03)
    pad_y = int((y1 - y0) * 0.03)
    return (
        max(0, int(x0 * inv) - pad_x),
        max(0, int(y0 * inv) - pad_y),
        min(w, int(x1 * inv) + pad_x),
        min(h, int(y1 * inv) + pad_y),
    )


def process_image(src: Path, dst: Path) -> bool:
    try:
        im = Image.open(src).convert("RGB")
    except OSError:
        return False

    w, h = im.size
    rgb = np.array(im, dtype=np.float32)
    area = w * h

    if area > 650_000 or max(w, h) > 1500:
        box = find_crop_box(rgb)
        if box:
            im = im.crop(box)

    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.08)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, format="JPEG", quality=92, optimize=True)
    return dst.exists() and dst.stat().st_size > 8_000


def foto_path(folder: Path, folder_name: str) -> Path:
    return folder / f"{folder_name}_foto.jpeg"


def main() -> None:
    ap = argparse.ArgumentParser(description="Recortar foto limpa do produto (PDF)")
    ap.add_argument("--slug", default="calcinhas", help="Pasta em dados/extracao_pdf/")
    args = ap.parse_args()

    cat_dir = EXTRACAO / args.slug
    catalog = cat_dir / "_catalogo.json"
    if not catalog.exists():
        print(f"Catálogo não encontrado: {catalog}")
        return

    items = json.loads(catalog.read_text(encoding="utf-8"))
    ok = 0
    skip = 0

    for raw in items:
        pasta = raw.get("pasta") or ""
        folder = BASE / pasta.replace("/", "\\") if pasta else None
        if not folder or not folder.is_dir():
            skip += 1
            continue

        folder_name = folder.name
        dst = foto_path(folder, folder_name)
        src = pick_best_source(folder)
        if not src:
            skip += 1
            continue

        if process_image(src, dst):
            ok += 1
        else:
            skip += 1

    print(f"Concluído ({args.slug}): {ok} fotos limpas · {skip} ignorados")


if __name__ == "__main__":
    main()
