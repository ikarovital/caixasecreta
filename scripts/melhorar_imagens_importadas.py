# -*- coding: utf-8 -*-
"""
Rebaixa imagens importadas (Miess/VTEX) em alta resolução + nitidez.

Uso:
  python scripts/melhorar_imagens_importadas.py
  python scripts/melhorar_imagens_importadas.py --slug cosmeticos
  python scripts/melhorar_imagens_importadas.py --limite 20
"""
from __future__ import annotations

import argparse
import json
import re
import time
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance

from importar_miess import (
    HEADERS,
    IMG_ROOT,
    OUT_JSON,
    VTEX_SEARCH,
    download_and_process_image,
    http_get,
    load_existing,
    save_product_image,
)

BASE = Path(__file__).resolve().parents[1]
TARGET_MIN_SIDE = 900
VTEX_SIZE = "1200-1200"


def sharpen_image(im: Image.Image, factor: float = 1.12) -> Image.Image:
    return ImageEnhance.Sharpness(im).enhance(factor)


def save_product_image_hq(
    data: bytes,
    dest_png: Path,
    *,
    remover_fundo: bool,
    threshold: int,
    softness: int,
) -> bool:
    from importar_miess import remove_white_background

    try:
        im = Image.open(BytesIO(data))
    except OSError:
        return False
    w, h = im.size
    if max(w, h) < TARGET_MIN_SIDE:
        scale = TARGET_MIN_SIDE / max(w, h)
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    im = sharpen_image(im.convert("RGBA" if remover_fundo else "RGB"))
    if remover_fundo:
        im = remove_white_background(im, threshold=threshold, softness=softness)
    dest_png.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest_png, format="PNG", optimize=True)
    return dest_png.stat().st_size > 800


def vtex_size_from_url(url: str) -> int:
    m = re.search(r"-(\d+)-(\d+)/", url or "")
    if not m:
        return 0
    return int(m.group(1)) * int(m.group(2))


def best_image_url_from_item(item: dict) -> str | None:
    images = item.get("images") or []
    best_url = None
    best_area = 0
    for img in images:
        url = (img.get("imageUrl") or "").strip()
        if not url:
            continue
        area = vtex_size_from_url(url)
        if area >= best_area:
            best_area = area
            best_url = url
    if not best_url:
        return None
    return re.sub(r"-\d+-\d+/", f"-{VTEX_SIZE}/", best_url, count=1)


def product_id_from_record(rec: dict) -> str | None:
    pid = rec.get("id") or ""
    m = re.search(r"-(\d+)$", pid)
    if m:
        return m.group(1)
    return None


def fetch_vtex_product(product_id: str) -> dict | None:
    url = f"{VTEX_SEARCH}/?fq=productId:{product_id}"
    try:
        data = json.loads(http_get(url))
    except Exception:
        return None
    if isinstance(data, list) and data:
        return data[0]
    return None


def improve_record(
    rec: dict,
    *,
    remover_fundo: bool,
    threshold: int,
    softness: int,
) -> bool:
    slug = rec.get("categorySlug") or "outros"
    product_id = product_id_from_record(rec)
    if not product_id:
        return False

    vtex = fetch_vtex_product(product_id)
    if not vtex:
        return False
    items = vtex.get("items") or []
    if not items:
        return False
    img_url = best_image_url_from_item(items[0])
    if not img_url:
        return False

    dest = IMG_ROOT / slug / f"{product_id}.png"
    try:
        data = http_get(img_url)
    except Exception:
        return False
    if len(data) < 800:
        return False
    return save_product_image_hq(
        data,
        dest,
        remover_fundo=remover_fundo,
        threshold=threshold,
        softness=softness,
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="Melhora imagens importadas (VTEX alta resolução)")
    ap.add_argument("--slug", help="Só esta categoria (ex.: cosmeticos)")
    ap.add_argument("--limite", type=int, default=0, help="Máximo de produtos (0 = todos)")
    ap.add_argument("--com-fundo", action="store_true")
    ap.add_argument("--fundo-limite", type=int, default=248)
    ap.add_argument("--fundo-suave", type=int, default=22)
    args = ap.parse_args()

    remover_fundo = not args.com_fundo
    records = load_existing()
    if args.slug:
        records = [r for r in records if r.get("categorySlug") == args.slug]
    if args.limite > 0:
        records = records[: args.limite]

    print(f"Melhorando {len(records)} imagens importadas (VTEX {VTEX_SIZE})…")
    ok = 0
    for i, rec in enumerate(records, 1):
        if improve_record(
            rec,
            remover_fundo=remover_fundo,
            threshold=args.fundo_limite,
            softness=args.fundo_suave,
        ):
            ok += 1
            rec["published"] = True
            rec["image"] = f"/importados/catalogo/{rec.get('categorySlug')}/{product_id_from_record(rec)}.png"
        if i % 10 == 0 or i == len(records):
            print(f"  {i}/{len(records)} — {ok} ok")
        time.sleep(0.25)

    by_id = {r["id"]: r for r in load_existing()}
    for rec in records:
        if rec.get("id") in by_id and rec.get("image"):
            by_id[rec["id"]]["image"] = rec["image"]
            by_id[rec["id"]]["published"] = rec.get("published", True)

    OUT_JSON.write_text(
        json.dumps(list(by_id.values()), ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Concluído: {ok}/{len(records)} imagens em alta resolução.")


if __name__ == "__main__":
    main()
