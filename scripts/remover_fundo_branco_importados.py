# -*- coding: utf-8 -*-
"""
Reprocessa PNGs do catálogo importado: remove fundo branco e mantém transparência.

Uso:
  python scripts/remover_fundo_branco_importados.py
  python scripts/remover_fundo_branco_importados.py --slug comestiveis
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

from imagem_fundo import save_transparent_catalog_png

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE / "frontend" / "public" / "importados" / "catalogo"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", help="Somente esta pasta (ex.: comestiveis)")
    args = ap.parse_args()

    root = (ROOT / args.slug) if args.slug else ROOT
    if not root.exists():
        print(f"Pasta não encontrada: {root}")
        return

    files = sorted(p for p in root.rglob("*.png") if p.is_file())
    ok = 0
    for i, path in enumerate(files, 1):
        try:
            im = Image.open(path)
            if save_transparent_catalog_png(im, path):
                ok += 1
        except OSError:
            pass
        if i % 20 == 0 or i == len(files):
            print(f"{i}/{len(files)} — {ok} ok")

    print(f"Concluído: {ok}/{len(files)} imagens sem fundo branco.")


if __name__ == "__main__":
    main()
