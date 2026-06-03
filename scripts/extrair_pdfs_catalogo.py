# -*- coding: utf-8 -*-
"""Extrai imagens e metadados dos catálogos PDF em dados/."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import fitz

BASE = Path(__file__).resolve().parents[1]
DADOS = BASE / "dados"
OUT = DADOS / "extracao_pdf"
def categoria_de_pdf(nome_arquivo: str) -> tuple[str, str]:
    n = nome_arquivo.lower()
    regras = [
        ("calcinhas", "Calcinhas", "calcinhas"),
        ("conjuntos", "Conjuntos", "conjuntos"),
        ("espartilhos", "Espartilhos", "espartilhos"),
        ("fantasias", "Fantasias", "fantasias"),
        ("vibradores", "Vibradores", "vibradores"),
        ("sex shop", "Sex Shop", "sex-shop"),
        ("sado", "Sado", "sado"),
    ]
    for chave, rotulo, pasta in regras:
        if chave in n:
            return rotulo, pasta
    stem = slug(nome_arquivo.rsplit(".", 1)[0], 40)
    return nome_arquivo.rsplit(".", 1)[0], stem


def listar_pdfs() -> list[tuple[str, str, str]]:
    itens = []
    for path in sorted(DADOS.glob("*.pdf")):
        rotulo, pasta = categoria_de_pdf(path.name)
        itens.append((path.name, rotulo, pasta))
    return itens


SKIP_PATTERNS = re.compile(
    r"catalogo|catálogo|atacado|sujeitos?\s+a\s+altera|consulte\s+sempre|vendedoras|"
    r"sadomasoquismo|consentimento\s+m[uú]tuo|maiores\s+de\s+18|faz\s+sua\s+vida\s+vibrar",
    re.I,
)
REF_RE = re.compile(r"ref\s*[:.]?\s*(\d+)", re.I)
PRICE_RE = re.compile(r"R\$\s*([\d.,]+)", re.I)


def slug(s: str, max_len: int = 80) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "-", s.strip()).strip("-").lower()
    return (s[:max_len] or "produto").strip("-")


def parse_price(raw: str) -> str | None:
    raw = raw.replace(".", "").replace(",", ".") if raw.count(",") == 1 else raw.replace(",", "")
    try:
        return f"{float(raw):.2f}"
    except ValueError:
        return None


def is_skip_page(text: str) -> bool:
    t = text.lower()
    if len(t) < 30:
        return True
    if SKIP_PATTERNS.search(t) and not REF_RE.search(t):
        return True
    if "catalogo de" in t and "ref:" not in t.lower():
        return True
    return False


def split_line_by_refs(line: str) -> list[str]:
    """Uma linha com vários Ref: vira várias linhas (ex.: página com 2 produtos no mesmo bloco)."""
    matches = list(REF_RE.finditer(line))
    if len(matches) <= 1:
        return [line]
    parts: list[str] = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(line)
        chunk = line[start:end].strip()
        if chunk:
            parts.append(chunk)
    return parts or [line]


def lines_from_page(page: fitz.Page) -> list[str]:
    raw = [ln.strip() for ln in page.get_text("text").splitlines() if ln.strip()]
    expanded: list[str] = []
    for ln in raw:
        if SKIP_PATTERNS.search(ln) and not REF_RE.search(ln):
            continue
        expanded.extend(split_line_by_refs(ln))
    return expanded


def blocks_by_ref(page: fitz.Page) -> list[list[str]]:
    """Agrupa por Ref (funciona com produtos empilhados na mesma coluna)."""
    lines = lines_from_page(page)
    groups: list[list[str]] = []
    current: list[str] = []
    for ln in lines:
        has_ref = bool(REF_RE.search(ln))
        if has_ref and current and any(REF_RE.search(x) for x in current):
            groups.append(current)
            current = [ln]
        elif has_ref and not current:
            current = [ln]
        else:
            current.append(ln)
    if current:
        groups.append(current)
    return [g for g in groups if REF_RE.search("\n".join(g))]


def blocks_for_page(page: fitz.Page) -> list[list[str]]:
    by_ref = blocks_by_ref(page)
    by_col = blocks_by_column(page)
    return by_ref if len(by_ref) >= len(by_col) else by_col


def blocks_by_column(page: fitz.Page) -> list[list[str]]:
    w = page.rect.width
    mid = w * 0.48
    left: list[tuple[float, str]] = []
    right: list[tuple[float, str]] = []
    for b in page.get_text("dict").get("blocks", []):
        if b.get("type") != 0:
            continue
        txt = " ".join(
            "".join(s["text"] for s in line["spans"]) for line in b.get("lines", [])
        ).strip()
        if not txt or SKIP_PATTERNS.search(txt):
            continue
        x0 = b["bbox"][0]
        y0 = b["bbox"][1]
        (left if x0 < mid else right).append((y0, txt))
    cols = []
    for col in (left, right):
        if not col:
            continue
        lines = [t for _, t in sorted(col, key=lambda x: x[0])]
        merged = " ".join(lines)
        if REF_RE.search(merged) or PRICE_RE.search(merged):
            cols.append(lines)
    if not cols:
        raw = [ln.strip() for ln in page.get_text("text").splitlines() if ln.strip()]
        raw = [ln for ln in raw if not SKIP_PATTERNS.search(ln)]
        if raw:
            cols.append(raw)
    return cols


def parse_product(lines: list[str], categoria: str, pdf_name: str, pagina: int) -> dict:
    text = "\n".join(lines)
    ref_m = REF_RE.search(text)
    ref = ref_m.group(1) if ref_m else None
    prices = [parse_price(m.group(1)) for m in PRICE_RE.finditer(text)]
    prices = [p for p in prices if p]
    preco = prices[0] if prices else None

    nome = None
    nome_parts: list[str] = []
    for ln in lines:
        low = ln.lower()
        if REF_RE.search(ln) or PRICE_RE.search(ln):
            continue
        if len(ln) < 3 or SKIP_PATTERNS.search(ln):
            continue
        if re.match(
            r"^(p\s*[-–]\s*m|tam|tamanho|cores?|opções|veste|aberta|calcinha|orelhas|r\$)",
            low,
        ):
            continue
        if re.match(r"^[\d\s\-–,]+$", ln):
            continue
        if low.startswith("conjunto") or low == "conjunto":
            nome_parts = [ln.split("|")[0].strip()]
            continue
        if nome_parts and len(ln) < 48:
            nome_parts.append(ln.split("|")[0].strip())
            nome = " ".join(nome_parts)
            break
        nome = ln.split("|")[0].strip()
        if len(nome) > 2:
            break

    if not nome and nome_parts:
        nome = " ".join(nome_parts)
    if not nome:
        nome = f"produto-pagina-{pagina}"

    descricao_linhas = []
    for ln in lines:
        if ln == nome:
            continue
        if REF_RE.search(ln) and ref:
            continue
        if PRICE_RE.search(ln) and preco:
            continue
        descricao_linhas.append(ln)

    return {
        "nome": nome,
        "ref": ref,
        "preco": preco,
        "categoria": categoria,
        "fonte_pdf": pdf_name,
        "pagina": pagina,
        "descricao": "\n".join(descricao_linhas).strip(),
        "texto_completo": text,
    }


def image_center(page: fitz.Page, xref: int) -> tuple[float, float]:
    rect = image_bbox(page, xref)
    if rect:
        return (rect.x0 + rect.x1) / 2, (rect.y0 + rect.y1) / 2
    return page.rect.width / 2, page.rect.height / 2


def image_bbox(page: fitz.Page, xref: int) -> fitz.Rect | None:
    for img in page.get_image_info(xrefs=True):
        if img["xref"] == xref:
            return fitz.Rect(img["bbox"])
    return None


def render_hi_res_crop(page: fitz.Page, xref: int, zoom: float = 3.0) -> tuple[bytes, str, int, int] | None:
    """Renderiza recorte da página em alta resolução (melhor que miniatura embutida)."""
    rect = image_bbox(page, xref)
    if not rect or rect.is_empty:
        return None
    pad = 6
    clip = rect + (-pad, -pad, pad, pad)
    clip &= page.rect
    mat = fitz.Matrix(zoom, zoom)
    try:
        pix = page.get_pixmap(matrix=mat, clip=clip, alpha=False)
    except Exception:
        return None
    if pix.width < 120 or pix.height < 120:
        return None
    return pix.tobytes("jpeg", jpg_quality=94), "jpeg", pix.width, pix.height


def extract_images(page: fitz.Page, doc: fitz.Document, min_side: int = 200, *, hi_res: bool = True) -> list[dict]:
    seen = set()
    items = []
    for img in page.get_images(full=True):
        xref = img[0]
        if xref in seen:
            continue
        seen.add(xref)
        try:
            info = doc.extract_image(xref)
        except Exception:
            continue
        w, h = info["width"], info["height"]
        if w < min_side or h < min_side:
            continue
        ext = info["ext"]
        data = info["image"]
        if hi_res:
            rendered = render_hi_res_crop(page, xref, zoom=3.0)
            if rendered:
                data, ext, rw, rh = rendered
                if rw * rh >= w * h * 0.85:
                    w, h = rw, rh
        cx, cy = image_center(page, xref)
        items.append(
            {
                "xref": xref,
                "width": w,
                "height": h,
                "ext": ext,
                "bytes": data,
                "cx": cx,
                "cy": cy,
                "area": w * h,
            }
        )
    items.sort(key=lambda x: -x["area"])
    return items


def assign_images_to_products(
    images: list[dict],
    n_products: int,
    page_width: float,
    page_height: float | None = None,
) -> list[list[dict]]:
    if n_products <= 0:
        return []
    if not images:
        return [[] for _ in range(n_products)]
    if n_products == 1:
        unique: list[dict] = []
        for im in sorted(images, key=lambda x: -x["area"]):
            if all(abs(im["cx"] - u["cx"]) > 45 or abs(im["cy"] - u["cy"]) > 45 for u in unique):
                unique.append(im)
        return [unique[:3]]

    page_height = page_height or 842.0
    mid = page_width * 0.48
    unique: list[dict] = []
    for im in sorted(images, key=lambda x: -x["area"]):
        if all(abs(im["cx"] - u["cx"]) > 45 or abs(im["cy"] - u["cy"]) > 45 for u in unique):
            unique.append(im)

    row_h = max(page_height / max(n_products, 2) * 0.55, 140)
    unique.sort(
        key=lambda x: (round(x["cy"] / row_h), 0 if x["cx"] < mid else 1, -x["area"])
    )
    slots = unique[:n_products]
    while len(slots) < n_products:
        slots.append(images[len(slots) % len(images)])
    mid = page_width * 0.48
    groups: list[list[dict]] = [[] for _ in range(n_products)]
    for im in sorted(images, key=lambda x: -x["area"]):
        if n_products == 2:
            col = 0 if im["cx"] < mid else 1
        else:
            col = min(n_products - 1, int(im["cy"] / max(page_height / n_products, 1)))
        bucket = groups[col]
        if len(bucket) >= 3:
            continue
        if all(abs(im["cx"] - u["cx"]) > 40 or abs(im["cy"] - u["cy"]) > 40 for u in bucket):
            bucket.append(im)
    for i, slot in enumerate(slots[:n_products]):
        if not groups[i]:
            groups[i] = [slot]
    return groups[:n_products]


def process_pdf(filename: str, categoria: str, pasta_slug: str | None = None) -> list[dict]:
    path = DADOS / filename
    out_dir = OUT / (pasta_slug or slug(categoria))
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(path)
    catalog = []

    for i in range(doc.page_count):
        page = doc[i]
        pagina = i + 1
        text_all = page.get_text("text")
        if is_skip_page(text_all):
            continue

        columns = blocks_for_page(page)
        if not columns:
            continue

        images = extract_images(page, doc, hi_res=True)
        img_groups = assign_images_to_products(
            images, len(columns), page.rect.width, page.rect.height
        )

        used_folders: set[str] = set()
        for idx, lines in enumerate(columns):
            prod = parse_product(lines, categoria, filename, pagina)
            ref_part = f"ref-{prod['ref']}" if prod["ref"] else f"p{pagina}"
            nome_part = slug(prod["nome"], 50)
            folder_name = f"{ref_part}_{nome_part}"
            if len(columns) > 1:
                folder_name += f"_col{idx + 1}"
            if folder_name in used_folders:
                folder_name += f"_n{idx + 1}"
            used_folders.add(folder_name)
            prod_dir = out_dir / folder_name
            prod_dir.mkdir(parents=True, exist_ok=True)

            imgs_out = []
            for j, im in enumerate(img_groups[idx] if idx < len(img_groups) else [], start=1):
                fname = f"{folder_name}_img{j}.{im['ext']}"
                fpath = prod_dir / fname
                fpath.write_bytes(im["bytes"])
                rel = str(fpath.relative_to(BASE)).replace("\\", "/")
                imgs_out.append(
                    {
                        "arquivo": rel,
                        "largura": im["width"],
                        "altura": im["height"],
                    }
                )

            prod["imagens"] = imgs_out
            prod["pasta"] = str(prod_dir.relative_to(BASE)).replace("\\", "/")
            info_path = prod_dir / "informacoes.json"
            info_path.write_text(
                json.dumps(prod, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            catalog.append(prod)

    doc.close()

    cat_path = out_dir / "_catalogo.json"
    cat_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    return catalog


def write_csv(all_items: list[dict]) -> None:
    import csv

    csv_path = OUT / "produtos_extraidos.csv"
    fields = [
        "categoria",
        "nome",
        "ref",
        "preco",
        "fonte_pdf",
        "pagina",
        "pasta",
        "imagens",
        "descricao",
    ]
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, delimiter=";")
        w.writeheader()
        for p in all_items:
            row = {k: p.get(k, "") for k in fields}
            row["imagens"] = " | ".join(i["arquivo"] for i in p.get("imagens", []))
            w.writerow(row)


def rebuild_csv_from_disk() -> list[dict]:
    all_items = []
    for cat_dir in sorted(OUT.iterdir()):
        if not cat_dir.is_dir():
            continue
        cat_file = cat_dir / "_catalogo.json"
        if cat_file.exists():
            all_items.extend(json.loads(cat_file.read_text(encoding="utf-8")))
    return all_items


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Extrai imagens e dados dos PDFs em dados/")
    parser.add_argument("--apenas", nargs="*", help="Só PDFs cujo nome contém estes textos")
    parser.add_argument("--rebuild-csv", action="store_true", help="Só regera CSV do que já foi extraído")
    args = parser.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)

    if args.rebuild_csv:
        merged = rebuild_csv_from_disk()
        write_csv(merged)
        print(f"CSV atualizado: {len(merged)} produtos")
        return

    pdfs = listar_pdfs()
    if args.apenas:
        filtros = [f.lower() for f in args.apenas]
        pdfs = [p for p in pdfs if any(f in p[0].lower() for f in filtros)]

    summary = []
    for pdf, cat, pasta in pdfs:
        print(f"Processando {pdf} -> {pasta}/ …")
        items = process_pdf(pdf, cat, pasta)
        summary.append({"pdf": pdf, "categoria": cat, "pasta": pasta, "produtos": len(items)})

    merged = rebuild_csv_from_disk()
    write_csv(merged)
    por_pasta = {}
    for p in merged:
        por_pasta[p.get("categoria", "?")] = por_pasta.get(p.get("categoria", "?"), 0) + 1
    (OUT / "_resumo.json").write_text(
        json.dumps(
            {"total": len(merged), "ultima_execucao": summary, "por_categoria": por_pasta},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Total no catálogo: {len(merged)} produtos -> {OUT}")


if __name__ == "__main__":
    main()
