# -*- coding: utf-8 -*-
"""Remove 'cada letra' e ajusta faixas de preço no PDF (preços mais baixos)."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

import fitz

from atualizar_precos_pdf import ajustar_tamanho, int_to_rgb

BASE = Path(__file__).resolve().parents[1]
DEFAULT_PDF = BASE / "dados" / "CALCINHAS 2026.pdf"
FONT = "tibo"

# Preço unitário (venda) -> texto novo (combo sem 2º R$ = cabe melhor na coluna)
PRECOS_CANONICOS: dict[float, str] = {
    15.0: "R$ 15,00 | 3x 35,00",
    25.0: "R$ 25,00 | 3x 60,00",
    32.0: "R$ 32,00 | 3x 85,00",
    35.0: "R$ 32,00 | 3x 85,00",
    42.0: "R$ 42,00 | 3x 95,00",
    45.0: "R$ 42,00 | 3x 95,00",
    52.0: "R$ 52,00 | 3x 135,00",
    53.0: "R$ 53,00 | 3x 130,00",
    60.0: "R$ 53,00 | 3x 130,00",
}


def texto_correto(unit: float) -> str | None:
    if unit in PRECOS_CANONICOS:
        return PRECOS_CANONICOS[unit]
    return None


def precisa_corrigir(text: str, unit: float) -> bool:
    esperado = texto_correto(unit)
    if not esperado:
        return False
    if text.strip() == esperado:
        return False
    # truncado ou formato antigo (3x R$...)
    if "3x R$" in text or len(text) < len(esperado) - 2:
        return True
    return text.strip() != esperado

REMOVE_RE = re.compile(r"cada\s+letra", re.I)
PRICE_INLINE_RE = re.compile(r"R\$\s*[\d.,]+.*\|.*3x", re.I)
UNIT_RE = re.compile(r"R\$\s*([\d.,]+)")


def parse_unit(text: str) -> float | None:
    m = UNIT_RE.search(text)
    if not m:
        return None
    s = m.group(1).replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def redact_only(page: fitz.Page, rect: fitz.Rect) -> None:
    faixa = fitz.Rect(rect)
    faixa.y0 -= 1
    faixa.y1 += 1
    page.add_redact_annot(faixa, fill=(1, 1, 1))
    page.apply_redactions()


def write_price(page: fitz.Page, rect: fitz.Rect, text: str, fontsize: float, color: tuple) -> None:
    redact_only(page, rect)
    largura_util = max(rect.width, 130.0)
    fontsize = ajustar_tamanho(text, fontsize, largura_util + 30, minimo=6.5)
    tw = fitz.get_text_length(text, fontname=FONT, fontsize=fontsize)
    x = rect.x0
    if x + tw > page.rect.width - 8:
        x = max(8.0, page.rect.width - tw - 8)
    page.insert_text(
        (x, rect.y0 + fontsize * 0.85),
        text,
        fontname=FONT,
        fontsize=fontsize,
        color=color,
    )


def iter_linhas(page: fitz.Page):
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = "".join(span["text"] for span in line["spans"]).strip()
            if not text:
                continue
            bbox = fitz.Rect(line["bbox"])
            span0 = line["spans"][0]
            style = {
                "size": span0.get("size", 16),
                "color": span0.get("color", 0),
            }
            yield text, bbox, style


def aplicar(pdf_path: Path) -> dict:
    backup = pdf_path.with_name(pdf_path.stem + "_antes_ajuste_cliente.pdf")
    if not backup.exists():
        shutil.copy2(pdf_path, backup)

    doc = fitz.open(pdf_path)
    stats = {"removidos_letra": 0, "precos_atualizados": 0}

    for pno in range(len(doc)):
        page = doc[pno]
        jobs_remove: list[fitz.Rect] = []
        jobs_price: list[tuple[fitz.Rect, str, float, tuple]] = []

        vistos: set[tuple[int, int]] = set()

        for text, bbox, style in iter_linhas(page):
            if REMOVE_RE.search(text):
                jobs_remove.append(bbox)
                continue
            if not (PRICE_INLINE_RE.search(text) or ("3x" in text and "R$" in text)):
                continue
            unit = parse_unit(text)
            if unit is None:
                continue
            novo = texto_correto(unit)
            if not novo or not precisa_corrigir(text, unit):
                continue
            chave = (int(bbox.y0), int(bbox.x0))
            if chave in vistos:
                continue
            vistos.add(chave)
            color = int_to_rgb(style["color"]) if style["color"] else (0.6, 0.18, 0.43)
            jobs_price.append((bbox, novo, style["size"], color))

        jobs_price.sort(key=lambda j: j[0].y0, reverse=True)
        for bbox in jobs_remove:
            redact_only(page, bbox)
            stats["removidos_letra"] += 1

        for bbox, novo, size, color in jobs_price:
            write_price(page, bbox, novo, size, color)
            stats["precos_atualizados"] += 1

    tmp = pdf_path.with_suffix(".tmp.pdf")
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    tmp.replace(pdf_path)
    return stats


if __name__ == "__main__":
    s = aplicar(DEFAULT_PDF)
    print(f"PDF: {DEFAULT_PDF}")
    print(f"Removidos 'cada letra': {s['removidos_letra']}")
    print(f"Preços ajustados: {s['precos_atualizados']}")
