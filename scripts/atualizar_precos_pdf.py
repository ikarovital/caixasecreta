# -*- coding: utf-8 -*-
"""Atualiza preços e combo (3 unidades) no PDF de calcinhas."""
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

import fitz
import pandas as pd

from precificacao_calcinhas import combo_tres, preco_venda, texto_preco_inline

BASE = Path(__file__).resolve().parents[1]
DEFAULT_PDF = BASE / "dados" / "CALCINHAS 2026_backup_antes_precos.pdf"
DEFAULT_XLSX = Path.home() / "Downloads" / "planilha_sexshop_combos_atualizada.xlsx"
CATALOGO_CALCINHAS = BASE / "dados" / "extracao_pdf" / "calcinhas" / "_catalogo.json"
SAIDA_PADRAO = BASE / "dados" / "CALCINHAS 2026.pdf"

REF_RE = re.compile(r"ref\s*[:.]?\s*(\d+)", re.I)
PRICE_RE = re.compile(r"R\$\s*([\d.,]+)(?:\s*cada|\s*\|)?", re.I)


def norm_ref(value) -> str:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ""
    s = str(value).strip()
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


def fmt_br_money(value: float, decimals: int = 2) -> str:
    txt = f"{value:,.{decimals}f}"
    return txt.replace(",", "X").replace(".", ",").replace("X", ".")


def int_to_rgb(color: int) -> tuple[float, float, float]:
    return ((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255


def load_planilha(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    df = pd.read_excel(path, sheet_name=0)
    cols = {c.lower(): c for c in df.columns}
    col_ref = next(c for k, c in cols.items() if "ref" in k)
    col_pag = next(
        c
        for k, c in cols.items()
        if "pag" in k.replace("á", "a") or (k.startswith("p") and "gina" in k)
    )
    col_venda = next(c for k, c in cols.items() if "venda" in k)
    col_combo = next(c for k, c in cols.items() if "3" in k or "unidad" in k)

    out: dict[str, dict] = {}
    for _, row in df.iterrows():
        ref = norm_ref(row[col_ref])
        if not ref:
            continue
        out[ref] = {
            "pagina": int(row[col_pag]),
            "preco_venda": parse_br_price(row[col_venda]),
            "combo3": parse_br_price(row[col_combo]),
            "fonte": "planilha",
        }
    return out


def load_catalogo() -> dict[str, dict]:
    if not CATALOGO_CALCINHAS.exists():
        return {}
    items = json.loads(CATALOGO_CALCINHAS.read_text(encoding="utf-8"))
    out: dict[str, dict] = {}
    for p in items:
        ref = norm_ref(p.get("ref"))
        if not ref:
            continue
        custo = parse_br_price(p.get("preco"))
        out[ref] = {"pagina": p.get("pagina"), "custo": custo, "nome": p.get("nome")}
    return out


def refs_on_page(page: fitz.Page) -> list[str]:
    refs: list[str] = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = "".join(span["text"] for span in line["spans"])
            m = REF_RE.search(text)
            if m:
                refs.append(norm_ref(m.group(1)))
    return refs


def refs_and_prices_on_page(page: fitz.Page) -> list[tuple[str, fitz.Rect, dict]]:
    entries: list[tuple[str, float, fitz.Rect, dict]] = []

    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = "".join(span["text"] for span in line["spans"]).strip()
            if not text:
                continue
            bbox = fitz.Rect(line["bbox"])
            y = bbox.y0
            span0 = line["spans"][0]
            style = {
                "size": span0.get("size", 14),
                "color": span0.get("color", 0),
                "font": span0.get("font", ""),
            }

            m_ref = REF_RE.search(text)
            if m_ref:
                entries.append(("ref", y, bbox, {"ref": norm_ref(m_ref.group(1))}))
                continue

            if PRICE_RE.search(text) and ("cada" in text.lower() or "|" in text or "3x" in text.lower()):
                entries.append(("price", y, bbox, {"text": text, "style": style}))
                continue

    entries.sort(key=lambda x: x[1])

    pairs: list[tuple[str, fitz.Rect, dict]] = []
    pending_ref: str | None = None
    for kind, _y, bbox, data in entries:
        if kind == "ref":
            pending_ref = data["ref"]
        elif kind == "price" and pending_ref:
            pairs.append((pending_ref, bbox, data))
            pending_ref = None

    return pairs


def extrair_custos_pdf(pdf_path: Path) -> dict[str, float]:
    custos: dict[str, float] = {}
    doc = fitz.open(pdf_path)
    for pno in range(len(doc)):
        page = doc[pno]
        pairs = refs_and_prices_on_page(page)
        refs = refs_on_page(page)

        for ref, _rect, data in pairs:
            m = PRICE_RE.search(data.get("text", ""))
            if m:
                c = parse_br_price(m.group(1))
                if c is not None:
                    custos[ref] = c

        if len(refs) > 1 and len(pairs) == 1:
            m = PRICE_RE.search(pairs[0][2].get("text", ""))
            if m:
                c = parse_br_price(m.group(1))
                if c is not None:
                    for ref in refs:
                        custos.setdefault(ref, c)
    doc.close()
    return custos


def montar_tabela_precos(
    planilha: dict[str, dict],
    catalogo: dict[str, dict],
    custos_pdf: dict[str, float],
) -> dict[str, dict]:
    """Monta preço venda + combo para todos os refs conhecidos."""
    refs = set(catalogo) | set(custos_pdf) | set(planilha)
    tabela: dict[str, dict] = {}

    for ref in refs:
        if ref in planilha and planilha[ref].get("preco_venda"):
            venda = planilha[ref]["preco_venda"]
            combo = planilha[ref].get("combo3") or combo_tres(int(venda))
            pagina = planilha[ref].get("pagina") or catalogo.get(ref, {}).get("pagina")
            fonte = "planilha"
        else:
            custo = (
                (catalogo.get(ref) or {}).get("custo")
                or custos_pdf.get(ref)
            )
            if custo is None:
                continue
            venda_f = float(preco_venda(custo))
            combo_f = float(combo_tres(int(venda_f)))
            venda, combo = venda_f, combo_f
            pagina = (catalogo.get(ref) or {}).get("pagina")
            fonte = "calculado"

        if pagina is None:
            continue

        tabela[ref] = {
            "pagina": int(pagina),
            "preco_venda": float(venda),
            "combo3": float(combo),
            "inline": texto_preco_inline(venda, combo),
            "fonte": fonte,
        }
    return tabela


FONT = "tibo"


def ajustar_tamanho(text: str, fontsize: float, largura_max: float, minimo: float = 8.0) -> float:
    sz = fontsize
    while sz > minimo and fitz.get_text_length(text, fontname=FONT, fontsize=sz) > largura_max:
        sz -= 0.5
    return sz


def redact_and_write(
    page: fitz.Page,
    rect: fitz.Rect,
    display_text: str,
    fontsize: float,
    color: tuple[float, float, float],
) -> None:
    faixa = fitz.Rect(rect)
    faixa.y0 -= 1
    faixa.y1 += 1
    page.add_redact_annot(faixa, fill=(1, 1, 1))
    page.apply_redactions()

    largura = max(rect.width * 1.35, 160.0)
    fontsize = ajustar_tamanho(display_text, fontsize, largura)
    tw = fitz.get_text_length(display_text, fontname=FONT, fontsize=fontsize)
    x_center = (rect.x0 + rect.x1) / 2
    x = max(rect.x0, x_center - tw / 2)
    if x + tw > rect.x1 + 48:
        x = rect.x0

    page.insert_text(
        (x, rect.y0 + fontsize * 0.85),
        display_text,
        fontname=FONT,
        fontsize=fontsize,
        color=color,
    )


def coletar_atualizacoes(doc: fitz.Document, tabela: dict[str, dict]) -> list[dict]:
    """Gera lista de retângulos a atualizar (uma entrada por faixa de preço no PDF)."""
    jobs: list[dict] = []
    visto_pagina_preco: set[tuple[int, int]] = set()

    for pagina in range(1, len(doc) + 1):
        page = doc[pagina - 1]
        pairs = refs_and_prices_on_page(page)
        refs = refs_on_page(page)
        compartilhado = len(refs) > 1 and len(pairs) == 1

        if compartilhado and pairs:
            ref_par, rect, data = pairs[0]
            custo_ref = tabela.get(ref_par) or next(
                (tabela[r] for r in refs if r in tabela),
                None,
            )
            if not custo_ref:
                continue
            key = (pagina, int(rect.y0))
            if key in visto_pagina_preco:
                continue
            visto_pagina_preco.add(key)
            jobs.append(
                {
                    "pagina": pagina,
                    "rect": rect,
                    "data": data,
                    "inline": custo_ref["inline"],
                    "ref": f"página {pagina} (preço único)",
                }
            )
            continue

        for ref, rect, data in pairs:
            if ref not in tabela:
                continue
            key = (pagina, int(rect.y0))
            if key in visto_pagina_preco:
                continue
            visto_pagina_preco.add(key)
            jobs.append(
                {
                    "pagina": pagina,
                    "rect": rect,
                    "data": data,
                    "inline": tabela[ref]["inline"],
                    "ref": ref,
                }
            )

    return jobs


def atualizar_pdf(
    pdf_path: Path,
    xlsx_path: Path | None,
    saida: Path,
    todos: bool = True,
) -> dict:
    planilha = load_planilha(xlsx_path) if xlsx_path and xlsx_path.exists() else {}
    catalogo = load_catalogo()
    custos_pdf = extrair_custos_pdf(pdf_path)
    tabela = montar_tabela_precos(planilha, catalogo, custos_pdf)

    shutil.copy2(pdf_path, saida)
    doc = fitz.open(saida)
    jobs = coletar_atualizacoes(doc, tabela)

    por_pagina: dict[int, list[dict]] = {}
    for job in jobs:
        por_pagina.setdefault(job["pagina"], []).append(job)

    stats = {
        "atualizados": 0,
        "planilha": sum(1 for t in tabela.values() if t["fonte"] == "planilha"),
        "calculados": sum(1 for t in tabela.values() if t["fonte"] == "calculado"),
        "refs_tabela": len(tabela),
        "faixas_pdf": 0,
        "nao_encontrados": [],
    }

    for pagina, itens in por_pagina.items():
        page = doc[pagina - 1]
        itens.sort(key=lambda j: j["rect"].y0, reverse=True)
        for job in itens:
            style = job["data"]["style"]
            color = int_to_rgb(style["color"]) if style["color"] else (0.6, 0.18, 0.43)
            size = style.get("size", 18)
            redact_and_write(page, job["rect"], job["inline"], size, color)
            stats["atualizados"] += 1
            stats["faixas_pdf"] += 1

    tmp = saida.with_suffix(".tmp.pdf")
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    tmp.replace(saida)
    stats["arquivo"] = str(saida)
    return stats


def main() -> None:
    ap = argparse.ArgumentParser(description="Atualizar preços no PDF CALCINHAS")
    ap.add_argument("--pdf", type=Path, default=DEFAULT_PDF)
    ap.add_argument("--xlsx", type=Path, default=DEFAULT_XLSX)
    ap.add_argument("-o", "--output", type=Path, default=SAIDA_PADRAO)
    args = ap.parse_args()

    stats = atualizar_pdf(args.pdf, args.xlsx, args.output)
    print(f"Arquivo: {stats['arquivo']}")
    print(f"Refs na tabela de preços: {stats['refs_tabela']}")
    print(f"  — da planilha: {stats['planilha']}")
    print(f"  — calculados (>100% lucro): {stats['calculados']}")
    print(f"Faixas de preço atualizadas no PDF: {stats['faixas_pdf']}")


if __name__ == "__main__":
    main()
