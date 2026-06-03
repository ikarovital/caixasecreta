# -*- coding: utf-8 -*-
"""
Importa produtos da Miess (VTEX) para o site local, sem alterar o catálogo PDF.

Uso:
  python scripts/importar_miess.py --paginas 4 --por-pagina 24
"""
from __future__ import annotations

import argparse
import json
import re
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parents[1]
OUT_JSON = BASE / "frontend" / "src" / "data" / "catalogo-importado.json"
IMG_ROOT = BASE / "frontend" / "public" / "importados" / "catalogo"
SOURCE_LABEL = "Catálogo importado — preço de referência no WhatsApp"

VTEX_SEARCH = (
    "https://miess.vtexcommercestable.com.br/api/catalog_system/pub/products/search"
)
PUBLIC_SITE = "https://www.miess.com.br"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "Accept": "application/json",
    "Accept-Language": "pt-BR,pt;q=0.9",
}


class _StripHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._parts: list[str] = []

    def handle_data(self, data: str) -> None:
        t = data.strip()
        if t:
            self._parts.append(t)


def strip_html(raw: str) -> str:
    if not raw:
        return ""
    parser = _StripHTML()
    try:
        parser.feed(raw)
    except Exception:
        return re.sub(r"<[^>]+>", " ", raw)
    text = " ".join(parser._parts)
    return re.sub(r"\s+", " ", text).strip()


def http_get(url: str, timeout: int = 45, retries: int = 4) -> bytes:
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            return urllib.request.urlopen(req, timeout=timeout).read()
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
            last_err = e
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"    retry {attempt + 1}/{retries - 1} ({e}) — aguardando {wait}s...")
                time.sleep(wait)
    raise last_err  # type: ignore[misc]


def fetch_page(path: str, order: str, start: int, end: int) -> list[dict]:
    q = f"{path}?O={order}&_from={start}&_to={end}"
    url = f"{VTEX_SEARCH}/{q}"
    HEADERS["Referer"] = f"{PUBLIC_SITE}/{path}?O={order}"
    data = json.loads(http_get(url))
    return data if isinstance(data, list) else []


def fetch_products_pages(
    path: str, order: str, *, por_pagina: int, paginas: int
) -> list[dict]:
    """Equivalente às páginas ?page=1..N do site (24 itens por página na Miess)."""
    seen: set[str] = set()
    products: list[dict] = []
    for page in range(1, paginas + 1):
        start = (page - 1) * por_pagina
        end = start + por_pagina - 1
        print(f"  Página {page}: itens {start}–{end}...")
        batch = fetch_page_safe(path, order, start, end)
        added = 0
        for p in batch:
            pid = str(p.get("productId") or "")
            if pid and pid in seen:
                continue
            if pid:
                seen.add(pid)
            products.append(p)
            added += 1
        print(f"    +{added} novos (total {len(products)})")
        if not batch:
            break
        time.sleep(1.2)
    return products


def fetch_page_safe(path: str, order: str, start: int, end: int) -> list[dict]:
    try:
        return fetch_page(path, order, start, end)
    except Exception as e:
        print(f"    aviso: falha na página ({e})")
        return []


def remove_white_background(
    im: Image.Image, *, threshold: int = 242, softness: int = 20
) -> Image.Image:
    """Remove fundo branco/claro; salvar como PNG com transparência."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    low = threshold - softness
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            m = min(r, g, b)
            if m >= threshold:
                px[x, y] = (r, g, b, 0)
            elif m > low:
                fade = (m - low) / max(softness, 1)
                na = max(0, int(a * (1.0 - fade)))
                px[x, y] = (r, g, b, na)
    return im


def save_product_image(
    data: bytes,
    dest_png: Path,
    *,
    remover_fundo: bool,
    threshold: int,
    softness: int,
    min_side: int = 900,
) -> bool:
    try:
        im = Image.open(BytesIO(data))
    except OSError:
        return False
    w, h = im.size
    if max(w, h) < min_side:
        scale = min_side / max(w, h)
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    if remover_fundo:
        im = remove_white_background(im, threshold=threshold, softness=softness)
    else:
        im = im.convert("RGBA")
    dest_png.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest_png, format="PNG", optimize=True)
    return dest_png.stat().st_size > 800


def pick_item(product: dict) -> dict | None:
    items = product.get("items") or []
    return items[0] if items else None


def pick_offer(item: dict) -> dict:
    for seller in item.get("sellers") or []:
        offer = seller.get("commertialOffer") or {}
        if offer:
            return offer
    return {}


def pick_price(item: dict) -> float:
    price = pick_offer(item).get("Price")
    if price is not None:
        try:
            return float(price)
        except (TypeError, ValueError):
            pass
    return 0.0


def pick_list_price(item: dict) -> float | None:
    offer = pick_offer(item)
    for key in ("ListPrice", "PriceWithoutDiscount"):
        val = offer.get(key)
        if val is None:
            continue
        try:
            v = float(val)
            return v if v > 0 else None
        except (TypeError, ValueError):
            pass
    return None


def vtex_image_area(url: str) -> int:
    m = re.search(r"-(\d+)-(\d+)/", url or "")
    if not m:
        return 0
    return int(m.group(1)) * int(m.group(2))


def pick_image_url(item: dict, *, target_size: str = "1200-1200") -> str | None:
    images = item.get("images") or []
    best_url = None
    best_area = 0
    for img in images:
        url = (img.get("imageUrl") or "").strip()
        if not url:
            continue
        area = vtex_image_area(url)
        if area >= best_area:
            best_area = area
            best_url = url
    if not best_url:
        return None
    return re.sub(r"-\d+-\d+/", f"-{target_size}/", best_url, count=1)


def download_and_process_image(
    url: str,
    dest_png: Path,
    *,
    remover_fundo: bool,
    threshold: int,
    softness: int,
) -> bool:
    try:
        data = http_get(url)
    except (urllib.error.URLError, TimeoutError, OSError):
        return False
    if len(data) < 500:
        return False
    return save_product_image(
        data,
        dest_png,
        remover_fundo=remover_fundo,
        threshold=threshold,
        softness=softness,
    )


def product_url(product: dict) -> str:
    link_text = (product.get("linkText") or "").strip()
    if link_text.startswith("/"):
        return f"{PUBLIC_SITE}{link_text}/p"
    link = (product.get("link") or "").strip()
    if "miess.com.br" in link:
        return link.replace("miess.vtexcommercestable.com.br", "www.miess.com.br").replace(
            "secure.miess.com.br", "www.miess.com.br"
        )
    if link_text:
        return f"{PUBLIC_SITE}/{link_text.lstrip('/')}/p"
    return PUBLIC_SITE


def vtex_to_record(
    product: dict,
    *,
    slug: str,
    label: str,
    img_dir: Path,
    list_url: str,
    remover_fundo: bool,
    fundo_threshold: int,
    fundo_softness: int,
    import_rank: int,
) -> dict | None:
    item = pick_item(product)
    if not item:
        return None
    sku = str(item.get("itemId") or product.get("productId") or "")
    if not sku:
        return None

    local_image = None
    img_url = pick_image_url(item)
    if img_url:
        dest = img_dir / f"{sku}.png"
        if download_and_process_image(
            img_url,
            dest,
            remover_fundo=remover_fundo,
            threshold=fundo_threshold,
            softness=fundo_softness,
        ):
            local_image = f"/importados/catalogo/{slug}/{sku}.png"
        time.sleep(0.15)

    desc_raw = product.get("description") or product.get("metaTagDescription") or ""
    desc = strip_html(desc_raw)
    if len(desc) > 1200:
        desc = desc[:1197] + "…"

    ref = product.get("productReference") or product.get("productReferenceCode")
    ref_s = str(ref).strip() if ref else None
    list_price = pick_list_price(item)
    price = pick_price(item)
    release = (product.get("releaseDate") or "").strip() or None

    record = {
        "id": f"imp-{slug}-{sku}",
        "name": (product.get("productName") or "Produto").strip(),
        "ref": ref_s,
        "price": price,
        "category": label,
        "categorySlug": slug,
        "description": desc,
        "image": local_image,
        "page": None,
        "source": SOURCE_LABEL,
        "importSource": "importado",
        "importRank": import_rank,
        "published": bool(local_image),
        "active": True,
    }
    if list_price and list_price > price:
        record["listPrice"] = list_price
    if release:
        record["releaseDate"] = release
    return record


def load_existing() -> list[dict]:
    if not OUT_JSON.exists():
        return []
    return json.loads(OUT_JSON.read_text(encoding="utf-8"))


def save_merged(slug: str, new_items: list[dict]) -> None:
    existing = load_existing()
    by_id = {p["id"]: p for p in existing if p.get("id")}
    for item in new_items:
        old = by_id.get(item["id"])
        if old and "published" in old:
            item["published"] = old["published"]
        if old and "active" in old:
            item["active"] = old["active"]
        if old and old.get("createdAt"):
            item["createdAt"] = old["createdAt"]
        if old and old.get("stock") is not None:
            item["stock"] = old["stock"]
    kept = [p for p in existing if p.get("categorySlug") != slug]
    merged = kept + new_items
    OUT_JSON.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")


def cleanup_old_images(img_dir: Path, keep_png: bool = True) -> None:
    if not img_dir.exists():
        return
    for f in img_dir.iterdir():
        if not f.is_file():
            continue
        if f.suffix.lower() in (".jpg", ".jpeg", ".webp") or (
            keep_png and f.suffix.lower() == ".png"
        ):
            try:
                f.unlink()
            except OSError:
                pass


def main() -> None:
    ap = argparse.ArgumentParser(description="Importa produtos Miess para catalogo-importado.json")
    ap.add_argument("--slug", default="comestiveis", help="Slug no site (URL /comestiveis)")
    ap.add_argument("--path", default="sex-shop/comestiveis", help="Caminho VTEX da categoria")
    ap.add_argument("--titulo", default="Comestíveis", help="Nome exibido da categoria")
    ap.add_argument("--order", default="OrderByTopSaleDESC", help="Ordenação VTEX")
    ap.add_argument(
        "--url",
        default="https://www.miess.com.br/sex-shop/comestiveis?O=OrderByTopSaleDESC",
        help="URL de referência (lista)",
    )
    ap.add_argument("--paginas", type=int, default=4, help="Páginas do site (page=1..N)")
    ap.add_argument("--por-pagina", type=int, default=24, help="Itens por página (Miess = 24)")
    ap.add_argument(
        "--limite",
        type=int,
        default=0,
        help="Máximo total (0 = paginas * por_pagina)",
    )
    ap.add_argument(
        "--com-fundo",
        action="store_true",
        help="Mantém fundo original (não gera PNG transparente)",
    )
    ap.add_argument("--fundo-limite", type=int, default=242, help="Pixels claros viram transparentes")
    ap.add_argument("--fundo-suave", type=int, default=20, help="Suavização da borda")
    args = ap.parse_args()

    remover_fundo = not args.com_fundo
    total = args.limite or args.paginas * args.por_pagina

    print(
        f"Buscando {args.paginas} página(s) × {args.por_pagina} "
        f"= até {total} produtos em {args.path}..."
    )
    raw = fetch_products_pages(
        args.path, args.order, por_pagina=args.por_pagina, paginas=args.paginas
    )
    raw = raw[:total]
    print(f"Recebidos: {len(raw)} (fundo transparente: {'sim' if remover_fundo else 'não'})")

    img_dir = IMG_ROOT / args.slug
    cleanup_old_images(img_dir)

    records = []
    for i, p in enumerate(raw, 1):
        rec = vtex_to_record(
            p,
            slug=args.slug,
            label=args.titulo,
            img_dir=img_dir,
            list_url=args.url,
            remover_fundo=remover_fundo,
            fundo_threshold=args.fundo_limite,
            fundo_softness=args.fundo_suave,
            import_rank=i - 1,
        )
        if rec:
            records.append(rec)
        if i % 12 == 0:
            print(f"  Processados {i}/{len(raw)}...")

    save_merged(args.slug, records)
    with_img = sum(1 for r in records if r.get("image"))
    print(f"Salvos {len(records)} em {OUT_JSON.name} ({with_img} com imagem PNG)")
    print("Reinicie o VER-SITE-NOVO.bat e abra /%s" % args.slug)


if __name__ == "__main__":
    main()
