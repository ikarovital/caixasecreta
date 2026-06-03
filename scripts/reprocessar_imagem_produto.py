# -*- coding: utf-8 -*-
"""Reprocessa fotos de um produto (ex.: calcinhas ref 4)."""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE / "scripts"))
from imagem_fundo import save_transparent_catalog_png  # noqa: E402

IMAGES = Path(r"C:\Users\Ikaro\post\imagens_caixa_secreta\CALCINHA")
OUT = BASE / "frontend" / "public" / "importados" / "catalogo" / "calcinhas"


def ensure_rembg():
    try:
        import rembg  # noqa: F401
        return
    except Exception:
        subprocess.check_call(
            [os.environ.get("PYTHON", "python"), "-m", "pip", "install", "-q", "rembg", "onnxruntime"]
        )


def find_pair(ref: str, keyword: str) -> tuple[Path | None, Path | None]:
    frente = verso = None
    for p in IMAGES.iterdir():
        if not p.is_file() or p.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        name = p.name.lower()
        if keyword.lower() not in name and ref not in p.stem:
            continue
        if "verso" in name:
            verso = p
        elif "frente" in name:
            frente = p
    return frente, verso


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", default="4")
    ap.add_argument("--keyword", default="Metamorfose")
    ap.add_argument("--sem-rembg", action="store_true")
    args = ap.parse_args()

    frente_src, verso_src = find_pair(args.ref, args.keyword)
    if not frente_src:
        raise FileNotFoundError(f"Frente não encontrada para ref={args.ref} / {args.keyword}")

    session = None
    if not args.sem_rembg:
        ensure_rembg()
        from rembg import new_session

        session = new_session("u2net")

    safe = args.ref.lower().replace(" ", "")
    dest_f = OUT / f"{safe}-frente.png"
    dest_v = OUT / f"{safe}-verso.png"

    print("Frente:", frente_src.name)
    save_transparent_catalog_png(
        Image.open(frente_src),
        dest_f,
        use_rembg=not args.sem_rembg,
        rembg_session=session,
    )
    print("  ->", dest_f, dest_f.stat().st_size if dest_f.exists() else 0)

    if verso_src:
        print("Verso:", verso_src.name)
        save_transparent_catalog_png(
            Image.open(verso_src),
            dest_v,
            use_rembg=True,
            rembg_session=session,
        )
        print("  ->", dest_v, dest_v.stat().st_size if dest_v.exists() else 0)

    print("Concluído. Atualize o site com Ctrl+F5 (v=26).")


if __name__ == "__main__":
    main()
