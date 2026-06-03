# -*- coding: utf-8 -*-
"""Atualiza preços do catálogo SADO via planilha e remove páginas iniciais/finais."""
from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path

import fitz
import pandas as pd

BASE = Path(__file__).resolve().parents[1]
DEFAULT_PDF = BASE / "dados" / "SADO MARÇO 2026.pdf"
DEFAULT_XLSX = Path.home() / "Downloads" / "planilha_catalogo_sado_completo.xlsx"
PAGINAS_REMOVER = [1, 2, 54, 55, 56]  # 1-indexado

REF_RE = re.compile(r"ref\s*[:.]?\s*([\d.]+)", re.I)
PRICE_RE = re.compile(r"R\$\s*([\d.,]+)", re.I)
FONT = "helv"


def norm_ref(value) -> str:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ""
    s = str(value).strip()
    try:
        f = float(s.replace(",", "."))
        if f == int(f):
            return str(int(f))
    except ValueError:
        pass
    if s.isdigit():
        return str(int(s))
    return s


def parse_br_price(value) -> float | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).strip().replace("R$", "").strip()
    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    else:
        s = s.replace(",", "")
    try:
        return float(s)
    except ValueError:
        return None


def fmt_br_money(value: float) -> str:
    txt = f"{value:,.2f}"
    return txt.replace(",", "X").replace(".", ",").replace("X", ".")


def fmt_preco_pdf(value: float, com_espaco: bool = False, cada: bool = False) -> str:
    n = fmt_br_money(value)
    base = f"R$ {n}" if com_espaco else f"R${n}"
    return f"{base} cada" if cada else base


def int_to_rgb(color: int) -> tuple[float, float, float]:
    if color == 16777215:  # branco em fundo escuro
        return (1.0, 1.0, 1.0)
    return ((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255


def load_planilha(path: Path) -> dict[str, float]:
    df = pd.read_excel(path, sheet_name=0)
    cols = {c.lower(): c for c in df.columns}
    col_ref = next(c for k, c in cols.items() if "ref" in k)
    col_novo = next(c for k, c in cols.items() if "novo" in k)

    out: dict[str, float] = {}
    for _, row in df.iterrows():
        ref = norm_ref(row[col_ref])
        preco = parse_br_price(row[col_novo])
        if ref and preco is not None:
            out[ref] = preco
    return out


def refs_and_prices_on_page(page: fitz.Page) -> list[tuple[str, fitz.Rect, dict]]:
    linhas: list[tuple[float, str, fitz.Rect, dict]] = []

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
                "com_espaco": "R$ " in text,
                "cada": "cada" in text.lower(),
            }
            linhas.append((bbox.y0, text, bbox, style))

    linhas.sort(key=lambda x: x[0])
    sequencia: list[tuple] = []

    for _y, text, bbox, style in linhas:
        refs = [norm_ref(m.group(1)) for m in REF_RE.finditer(text)]
        m_price = PRICE_RE.search(text)

        if refs and m_price and len(text) < 120:
            for ref in refs:
                sequencia.append(("pair", ref, bbox, {**style, "text": text}))
            continue
        if refs:
            for ref in refs:
                sequencia.append(("ref", ref))
            continue
        if m_price and len(text) < 50:
            sequencia.append(("price", bbox, {**style, "text": text}))

    pares: list[tuple[str, fitz.Rect, dict]] = []
    buf_refs: list[str] = []
    buf_prices: list[tuple[fitz.Rect, dict]] = []

    def commit() -> None:
        nonlocal buf_refs, buf_prices
        if not buf_prices:
            buf_refs = []
            return
        if len(buf_prices) == 1:
            rect, style = buf_prices[0]
            for ref in buf_refs:
                pares.append((ref, rect, style))
        elif buf_refs:
            for i, ref in enumerate(buf_refs):
                rect, style = buf_prices[min(i, len(buf_prices) - 1)]
                pares.append((ref, rect, style))
        buf_refs = []
        buf_prices = []

    for item in sequencia:
        if item[0] == "ref":
            buf_refs.append(item[1])
        elif item[0] == "price":
            buf_prices.append((item[1], item[2]))
        elif item[0] == "pair":
            commit()
            pares.append((item[1], item[2], item[3]))
    commit()

    return pares


def ajustar_fonte(texto: str, tamanho: float, largura: float) -> float:
    sz = tamanho
    while sz > 8 and fitz.get_text_length(texto, fontname=FONT, fontsize=sz) > largura:
        sz -= 0.5
    return sz


def substituir_preco(page: fitz.Page, rect: fitz.Rect, texto: str, style: dict) -> None:
    faixa = fitz.Rect(rect)
    faixa.y0 -= 1
    faixa.y1 += 1
    page.add_redact_annot(faixa, fill=(0, 0, 0))
    page.apply_redactions()

    cor = int_to_rgb(style.get("color", 0))
    sz = ajustar_fonte(texto, style.get("size", 18), max(rect.width * 1.2, 80))
    tw = fitz.get_text_length(texto, fontname=FONT, fontsize=sz)
    x = rect.x0
    if x + tw > rect.x1 + 30:
        x = max(rect.x0, (rect.x0 + rect.x1) / 2 - tw / 2)
    page.insert_text(
        (x, rect.y0 + sz * 0.85),
        texto,
        fontname=FONT,
        fontsize=sz,
        color=cor,
    )


def remover_paginas(doc: fitz.Document, paginas_1_index: list[int]) -> None:
    for num in sorted(paginas_1_index, reverse=True):
        idx = num - 1
        if 0 <= idx < len(doc):
            doc.delete_page(idx)


def processar(
    pdf_path: Path,
    xlsx_path: Path,
    saida: Path | None = None,
    remover: list[int] | None = None,
) -> dict:
    precos = load_planilha(xlsx_path)
    dest = saida or pdf_path
    if dest.resolve() != pdf_path.resolve():
        shutil.copy2(pdf_path, dest)
    else:
        bak = pdf_path.with_name(pdf_path.stem + "_antes_precos.pdf")
        if not bak.exists():
            shutil.copy2(pdf_path, bak)

    doc = fitz.open(dest)
    stats = {"atualizados": 0, "nao_encontrados": [], "sem_preco_planilha": []}
    # Um retângulo de preço por página (evita sobrescrever 2x o mesmo campo)
    jobs_por_rect: dict[tuple[int, int, int], dict] = {}

    for pno in range(len(doc)):
        page = doc[pno]
        for ref, rect, style in refs_and_prices_on_page(page):
            novo = precos.get(ref)
            if novo is None:
                stats["sem_preco_planilha"].append(ref)
                continue
            texto_novo = fmt_preco_pdf(
                novo,
                com_espaco=style.get("com_espaco", False),
                cada=style.get("cada", False),
            )
            chave = (pno + 1, int(rect.y0), int(rect.x0))
            if chave not in jobs_por_rect:
                jobs_por_rect[chave] = {
                    "pagina": pno + 1,
                    "ref": ref,
                    "rect": rect,
                    "style": style,
                    "texto": texto_novo,
                }

    por_pagina: dict[int, list] = {}
    for job in jobs_por_rect.values():
        por_pagina.setdefault(job["pagina"], []).append(job)

    for pagina, itens in por_pagina.items():
        page = doc[pagina - 1]
        itens.sort(key=lambda j: j["rect"].y0, reverse=True)
        for job in itens:
            substituir_preco(page, job["rect"], job["texto"], job["style"])
            stats["atualizados"] += 1

    if remover:
        remover_paginas(doc, remover)
        stats["paginas_removidas"] = remover

    tmp = dest.with_suffix(".tmp.pdf")
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    tmp.replace(dest)
    stats["arquivo"] = str(dest)
    stats["paginas_final"] = fitz.open(dest).page_count
    fitz.open(dest).close()
    return stats


def main() -> None:
    ap = argparse.ArgumentParser(description="Atualizar PDF SADO")
    ap.add_argument("--pdf", type=Path, default=DEFAULT_PDF)
    ap.add_argument("--xlsx", type=Path, default=DEFAULT_XLSX)
    ap.add_argument("-o", "--output", type=Path, default=None)
    ap.add_argument(
        "--manter-paginas",
        action="store_true",
        help="Não remove páginas 1,2,54,55,56",
    )
    args = ap.parse_args()

    remover = None if args.manter_paginas else PAGINAS_REMOVER
    stats = processar(args.pdf, args.xlsx, args.output or args.pdf, remover=remover)

    print(f"Arquivo: {stats['arquivo']}")
    print(f"Páginas finais: {stats['paginas_final']}")
    print(f"Preços atualizados: {stats['atualizados']}")
    if stats.get("sem_preco_planilha"):
        uniq = sorted(set(stats["sem_preco_planilha"]))[:20]
        print(f"Refs no PDF sem preço na planilha ({len(set(stats['sem_preco_planilha']))}): {uniq}")


if __name__ == "__main__":
    main()
