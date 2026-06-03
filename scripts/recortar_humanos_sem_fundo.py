# -*- coding: utf-8 -*-
"""
Recorta fundo (background removal) de fotos com modelos/humanos e atualiza o catálogo.

Estratégia:
- Processa apenas imagens do catálogo que vêm de /extracao_pdf
- Foca em categorias tipicamente com humano: calcinhas, conjuntos, espartilhos, fantasias
- Para cada imagem usada no catálogo (jpg/jpeg/webp), gera um PNG ao lado com sufixo _cutout.png
- Atualiza frontend/src/data/catalogo-lingerie.json para apontar para o _cutout.png

Requisitos (instalado automaticamente pelo script):
  pip install rembg pillow onnxruntime

Uso:
  python scripts/recortar_humanos_sem_fundo.py
  python scripts/recortar_humanos_sem_fundo.py --slug conjuntos
  python scripts/recortar_humanos_sem_fundo.py --limite 20
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

BASE = Path(__file__).resolve().parents[1]
MIN_CUTOUT_CONTENT_PX = 520
CATALOG_JSON = BASE / "frontend" / "src" / "data" / "catalogo-lingerie.json"
EXTRACAO_ROOT = BASE / "dados" / "extracao_pdf"

DEFAULT_SLUGS = {"calcinhas", "conjuntos", "espartilhos", "fantasias"}


def ensure_deps() -> None:
    try:
        import rembg  # noqa: F401
        return
    except Exception:
        pass
    print("Instalando dependências (rembg/onnxruntime)…")
    subprocess.check_call(
        [
            os.environ.get("PYTHON", "python"),
            "-m",
            "pip",
            "install",
            "-q",
            "rembg",
            "onnxruntime",
            "pillow",
        ]
    )


def to_disk_path(image_url: str) -> Path | None:
    if not image_url:
        return None
    if not image_url.startswith("/extracao_pdf/"):
        return None
    rel = image_url[len("/extracao_pdf/") :].lstrip("/").replace("/", os.sep)
    p = EXTRACAO_ROOT / rel
    return p if p.exists() else None


def cutout_path(catalog_src: Path) -> Path:
    stem = catalog_src.stem
    if not stem.endswith("_img1") and "_img" not in stem:
        for candidate in sorted(catalog_src.parent.glob("*_img1.*")):
            stem = candidate.stem
            break
    return catalog_src.with_name(f"{stem}_cutout").with_suffix(".png")


def best_source_path(src: Path) -> Path:
    """Prefere recorte limpo do catálogo (_foto.jpeg) quando existir."""
    foto = src.parent / f"{src.parent.name}_foto.jpeg"
    if foto.exists() and foto.stat().st_size > 8_000:
        return foto
    return src


def cutout_content_min(path: Path) -> int:
    try:
        with Image.open(path) as im:
            im = im.convert("RGBA")
            alpha = np.array(im)[:, :, 3]
            ys, xs = np.where(alpha > 30)
            if len(xs) == 0:
                return 0
            cw = int(xs.max() - xs.min() + 1)
            ch = int(ys.max() - ys.min() + 1)
            return min(cw, ch)
    except Exception:
        return 0


def composite_white_cutout(path: Path) -> bool:
    try:
        im = Image.open(path).convert("RGBA")
    except OSError:
        return False
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    out = ImageEnhance.Sharpness(ImageEnhance.Contrast(bg.convert("RGB")).enhance(1.05)).enhance(1.1)
    out.save(path, format="PNG", optimize=True)
    return True


def already_good(png: Path) -> bool:
    if not png.exists() or png.stat().st_size < 20_000:
        return False
    try:
        with Image.open(png) as im:
            if im.mode not in ("RGBA", "LA") or min(im.size) < 420:
                return False
        return cutout_content_min(png) >= MIN_CUTOUT_CONTENT_PX
    except Exception:
        return False


def run_cutout(src: Path, dst: Path) -> bool:
    ensure_deps()
    from rembg import new_session, remove

    dst.parent.mkdir(parents=True, exist_ok=True)

    # session única melhora performance
    if not hasattr(run_cutout, "_sess"):
        run_cutout._sess = new_session("u2net")  # type: ignore[attr-defined]

    try:
        with Image.open(src) as im:
            im = im.convert("RGBA")
            out = remove(im, session=run_cutout._sess)  # type: ignore[attr-defined]
            out.save(dst, format="PNG", optimize=True)
        return dst.exists() and dst.stat().st_size > 20_000
    except Exception:
        return False


def main() -> None:
    ap = argparse.ArgumentParser(description="Recortar fundo de fotos com modelos e atualizar catálogo")
    ap.add_argument("--slug", help="Somente esta categoria (ex.: conjuntos)")
    ap.add_argument("--limite", type=int, default=0, help="Máximo de itens (0=sem limite)")
    args = ap.parse_args()

    items = json.loads(CATALOG_JSON.read_text(encoding="utf-8"))
    slugs = {args.slug} if args.slug else set(DEFAULT_SLUGS)

    changed = 0
    processed = 0
    ok = 0

    for p in items:
        if p.get("categorySlug") not in slugs:
            continue
        img = p.get("image") or ""
        catalog_src = to_disk_path(img)
        if not catalog_src:
            continue
        if catalog_src.suffix.lower() not in (".jpg", ".jpeg", ".webp", ".png"):
            continue

        src = best_source_path(catalog_src)
        processed += 1
        if args.limite and processed > args.limite:
            break

        dst = cutout_path(catalog_src)
        if already_good(dst):
            composite_white_cutout(dst)
            p["image"] = f"/extracao_pdf/{dst.relative_to(EXTRACAO_ROOT).as_posix()}"
            ok += 1
            changed += 1
            continue

        if run_cutout(src, dst) and cutout_content_min(dst) >= MIN_CUTOUT_CONTENT_PX:
            composite_white_cutout(dst)
            p["image"] = f"/extracao_pdf/{dst.relative_to(EXTRACAO_ROOT).as_posix()}"
            ok += 1
            changed += 1
        elif src.parent / f"{src.parent.name}_foto.jpeg" == src:
            foto_url = f"/extracao_pdf/{src.relative_to(EXTRACAO_ROOT).as_posix()}"
            p["image"] = foto_url
            ok += 1
            changed += 1

        if processed % 10 == 0:
            print(f"{processed} processados — {ok} recortes OK")

    CATALOG_JSON.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Concluído: {processed} analisados — {ok} recortes OK — {changed} itens atualizados no catálogo.")


if __name__ == "__main__":
    main()

