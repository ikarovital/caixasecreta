# -*- coding: utf-8 -*-
from __future__ import annotations

"""
Corrige imagens importadas (PNG) para ficar bonitas no fundo escuro do site:
- remove transparência (composita em fundo branco)
- leve nitidez e contraste

Uso:
  python scripts/corrigir_imagens_importadas_fundo_branco.py
  python scripts/corrigir_imagens_importadas_fundo_branco.py --slug cosmeticos
"""

import argparse
from pathlib import Path

from PIL import Image, ImageEnhance

BASE = Path(__file__).resolve().parents[1]
IMPORTADOS_ROOT = BASE / "frontend" / "public" / "importados" / "catalogo"


def process_png(path: Path) -> bool:
    if path.suffix.lower() != ".png":
        return False

    try:
        im = Image.open(path).convert("RGBA")
    except OSError:
        return False

    # Fundo branco (tira halo no fundo escuro)
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    out = bg.convert("RGB")

    # Ajustes leves (sem “estourar” a arte)
    out = ImageEnhance.Contrast(out).enhance(1.06)
    out = ImageEnhance.Sharpness(out).enhance(1.12)

    tmp = path.with_suffix(".tmp.png")
    out.save(tmp, format="PNG", optimize=True)
    # Windows pode bloquear replace se estiver em uso; tenta algumas vezes
    for _ in range(6):
        try:
            tmp.replace(path)
            break
        except PermissionError:
            import time

            time.sleep(0.35)
    else:
        # não conseguiu substituir: limpa temp e sinaliza falha
        try:
            tmp.unlink(missing_ok=True)
        except OSError:
            pass
        return False
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description="Corrige PNGs importados com fundo branco")
    ap.add_argument("--slug", help="Somente esta pasta (ex.: cosmeticos)")
    args = ap.parse_args()

    root = (IMPORTADOS_ROOT / args.slug) if args.slug else IMPORTADOS_ROOT
    if not root.exists():
        print(f"Nada para processar: {root}")
        return

    files = sorted(p for p in root.rglob("*.png") if p.is_file())
    ok = 0
    for i, p in enumerate(files, 1):
        if process_png(p):
            ok += 1
        if i % 50 == 0 or i == len(files):
            print(f"{i}/{len(files)} processadas — {ok} ok")

    print(f"Concluído: {ok}/{len(files)} imagens corrigidas.")


if __name__ == "__main__":
    main()
