# -*- coding: utf-8 -*-
"""Remove as 2 primeiras páginas do catálogo e insere capa circular."""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

import fitz

BASE = Path(__file__).resolve().parents[1]
DEFAULT_PDF = BASE / "dados" / "CALCINHAS 2026.pdf"
DEFAULT_CAPA = BASE / "dados" / "capa-caixa-secreta.png"
FALLBACK_CAPA = (
    Path.home()
    / ".cursor/projects/c-Users-Ikaro-post/assets"
    / "c__Users_Ikaro_AppData_Roaming_Cursor_User_workspaceStorage_416515dff3fe24096ea6aefc30b0b8e9_images_template_circulo_marca-f0654c82-898a-42df-8121-9e5c93bbbd78.png"
)


def rect_central(page: fitz.Page, img_w: float, img_h: float, margem: float = 0.04) -> fitz.Rect:
    pw, ph = page.rect.width, page.rect.height
    escala = min((pw * (1 - 2 * margem)) / img_w, (ph * (1 - 2 * margem)) / img_h)
    w, h = img_w * escala, img_h * escala
    x0 = (pw - w) / 2
    y0 = (ph - h) / 2
    return fitz.Rect(x0, y0, x0 + w, y0 + h)


def aplicar_capa(pdf_path: Path, capa_path: Path, remover_paginas: int = 2) -> Path:
    if not capa_path.exists():
        capa_path = FALLBACK_CAPA
    if not capa_path.exists():
        raise FileNotFoundError(f"Capa não encontrada: {capa_path}")

    dados = capa_path.parent if capa_path.parent.name == "dados" else DEFAULT_CAPA.parent
    dados.mkdir(parents=True, exist_ok=True)
    if capa_path != DEFAULT_CAPA and capa_path.exists():
        shutil.copy2(capa_path, DEFAULT_CAPA)
        capa_path = DEFAULT_CAPA

    backup = pdf_path.with_name(pdf_path.stem + "_antes_capa.pdf")
    if not backup.exists():
        shutil.copy2(pdf_path, backup)

    doc = fitz.open(pdf_path)
    if len(doc) < remover_paginas:
        raise ValueError(f"PDF tem só {len(doc)} páginas.")

    for _ in range(remover_paginas):
        doc.delete_page(0)

    ref = doc[0]
    nova = doc.new_page(0, width=ref.rect.width, height=ref.rect.height)
    px = fitz.Pixmap(str(capa_path))
    img_w, img_h = px.width, px.height
    px = None
    nova.insert_image(rect_central(nova, img_w, img_h), filename=str(capa_path))

    tmp = pdf_path.with_suffix(".tmp.pdf")
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    tmp.replace(pdf_path)
    return pdf_path


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", type=Path, default=DEFAULT_PDF)
    ap.add_argument("--capa", type=Path, default=DEFAULT_CAPA)
    args = ap.parse_args()
    out = aplicar_capa(args.pdf, args.capa)
    print(f"OK: {out} ({fitz.open(out).page_count} páginas)")


if __name__ == "__main__":
    main()
