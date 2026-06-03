# -*- coding: utf-8 -*-
"""
Baixa imagens oficiais da Miess (VTEX) e atualiza PNGs do catálogo local.

Uso:
  python scripts/atualizar_imagens_miess_produto.py --slug calcinha-luxo-em-tule-com-detalhes-em-strass-colecao-metamorfose-tallyta-moda-apimentada-4-448 --ref 4
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE / "scripts"))
from imagem_fundo import save_transparent_catalog_png  # noqa: E402
from importar_miess import http_get, pick_image_url  # noqa: E402

VTEX = "https://miess.vtexcommercestable.com.br/api/catalog_system/pub/products/search"
LINGerie_JSON = BASE / "frontend" / "src" / "data" / "catalogo-lingerie.json"
IMG_OUT = BASE / "frontend" / "public" / "importados" / "catalogo" / "calcinhas"


def vtex_product(link_slug: str) -> dict:
    url = f"{VTEX}/{link_slug}"
    data = json.loads(http_get(url))
    if not data:
        # fallback: busca por termos
        q = "calcinha luxo strass metamorfose"
        url2 = f"{VTEX}/{q.replace(' ', '%20')}"
        data = json.loads(http_get(url2))
        data = [p for p in data if (p.get("linkText") or "") == link_slug]
    if not data:
        raise ValueError(f"Produto não encontrado: {link_slug}")
    return data[0]


def image_url_at(item: dict, index: int) -> str | None:
    images = item.get("images") or []
    if index >= len(images):
        return None
    url = (images[index].get("imageUrl") or "").strip()
    if not url:
        return None
    if re.search(r"-\d+-\d+/", url):
        return re.sub(r"-\d+-\d+/", "-1200-1200/", url, count=1).split("?")[0]
    return pick_image_url({"images": [images[index]]}) or url.split("?")[0]


def ensure_rembg():
    try:
        import rembg  # noqa: F401
        return
    except Exception:
        subprocess.check_call(
            [os.environ.get("PYTHON", "python"), "-m", "pip", "install", "-q", "rembg", "onnxruntime"]
        )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--ref", required=True)
    ap.add_argument("--frente-idx", type=int, default=0)
    ap.add_argument("--verso-idx", type=int, default=1)
    args = ap.parse_args()

    product = vtex_product(args.slug)
    item = (product.get("items") or [{}])[0]
    name = product.get("productName") or args.slug
    print("Miess:", name)

    url_frente = image_url_at(item, args.frente_idx)
    url_verso = image_url_at(item, args.verso_idx)
    if not url_frente:
        raise ValueError("Sem URL da foto frente")
    print("Frente:", url_frente)
    if url_verso:
        print("Verso:", url_verso)

    ensure_rembg()
    from rembg import new_session

    session = new_session("u2net")
    safe = str(args.ref).lower().strip()
    dest_f = IMG_OUT / f"{safe}-frente.png"
    dest_v = IMG_OUT / f"{safe}-verso.png"

    save_transparent_catalog_png(
        Image.open(BytesIO(http_get(url_frente))),
        dest_f,
        use_rembg=False,
        rembg_session=session,
    )
    print("OK frente:", dest_f.stat().st_size)

    if url_verso:
        save_transparent_catalog_png(
            Image.open(BytesIO(http_get(url_verso))),
            dest_v,
            use_rembg=True,
            rembg_session=session,
        )
        print("OK verso:", dest_v.stat().st_size)

    data = json.loads(LINGerie_JSON.read_text(encoding="utf-8"))
    ref = str(args.ref).strip()
    for p in data:
        if p.get("categorySlug") == "calcinhas" and str(p.get("ref", "")).strip() == ref:
            p["image"] = f"/importados/catalogo/calcinhas/{safe}-frente.png"
            if url_verso:
                p["imageBack"] = f"/importados/catalogo/calcinhas/{safe}-verso.png"
            p["source"] = "Miess — Catálogo oficial (VTEX)"
            p["miessUrl"] = f"https://www.miess.com.br/{args.slug}/p"
            break
    LINGerie_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Concluido. Recarregue com Ctrl+F5 (v=27).")


if __name__ == "__main__":
    main()
