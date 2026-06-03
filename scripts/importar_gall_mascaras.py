# -*- coding: utf-8 -*-
"""
Importa máscaras sensuais da Gall (atacado) para Fetiche e Sado.
Seleção curada: modelos mais diferentes entre os 30 da categoria.

Uso:
  python scripts/importar_gall_mascaras.py
  python scripts/importar_gall_mascaras.py --sem-imagem
"""
from __future__ import annotations

import argparse
import json
import re
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

from importar_miess import (
    OUT_JSON,
    IMG_ROOT,
    SOURCE_LABEL,
    download_and_process_image,
    load_existing,
    save_product_image,
)

BASE = Path(__file__).resolve().parents[1]
SLUG = "sado"
LABEL = "Fetiche e Sado"
ID_PREFIX = "imp-sado-gall-"
IMG_DIR = IMG_ROOT / SLUG
SOURCE_URL = "https://www.gall.com.br/sex-shop/sado/mascaras-sensuais"
# Preço atacado Gall → varejo (ajuste no WhatsApp)
PRICE_MARKUP = 2.2

# 14 itens distintos (evita várias Tiazinha, Vinil repetidas, Feminina 1308/1309, etc.)
CURATED = [
    {
        "name": "Máscara Sado Gata Raposa Sintética Prazer E Cia",
        "price_atacado": 20.48,
        "image": "17624343679651",
        "grupo": "animal-sintetico",
    },
    {
        "name": "Máscara Bunny Play Couro Sado Dominatrixxx",
        "price_atacado": 37.05,
        "image": "17568110331533",
        "grupo": "coelha-couro",
    },
    {
        "name": "Kit Coelha Máscara E Gravata Medusa Êxtase",
        "price_atacado": 37.05,
        "image": "17558699906855",
        "grupo": "kit-coelha",
    },
    {
        "name": "Máscara Coelha Em Plástico Abs Grande Yaffa",
        "price_atacado": 12.21,
        "image": "17544202375614",
        "grupo": "plastico-abs",
    },
    {
        "name": "Máscara Sado Luxo Metal Dourado Sexy Import",
        "price_atacado": 16.50,
        "image": "17573540103012",
        "grupo": "metal-dourado",
    },
    {
        "name": "Lilith Máscara Sado Diabinha Dominatrixxx",
        "price_atacado": 30.85,
        "image": "16874514108455",
        "grupo": "diabinha",
    },
    {
        "name": "Máscara Tecido Tiras Para Amarrar Vipmix",
        "price_atacado": 8.58,
        "image": "16722535297319",
        "grupo": "tecido-amarrar",
    },
    {
        "name": "Máscara Hannibal Dominatrixxx",
        "price_atacado": 21.55,
        "image": "17448055113930",
        "grupo": "personagem-hannibal",
    },
    {
        "name": "Máscara Sado Em Vinil Crystal Dominatrixxx",
        "price_atacado": 12.38,
        "image": "17199238695729",
        "grupo": "vinil",
    },
    {
        "name": "Máscara Felina Dominatrixxx",
        "price_atacado": 30.85,
        "image": "17562132682479",
        "grupo": "felina",
    },
    {
        "name": "Máscara Sensual Mulher Gato Hot Flowers",
        "price_atacado": 7.87,
        "image": "17395506783590",
        "grupo": "mulher-gato",
    },
    {
        "name": "Máscara Batman Preta Dominatrixxx",
        "price_atacado": 8.03,
        "image": "17434351078355",
        "grupo": "batman",
    },
    {
        "name": "Máscara Capuz Preta Lux Dominatrixxx",
        "price_atacado": 65.18,
        "image": "15257472666460",
        "grupo": "capuz-luxo",
    },
    {
        "name": "Máscara Tiazinha Verniz Dominatrixxx",
        "price_atacado": 5.29,
        "image": "15257489591838",
        "grupo": "tiazinha-verniz",
    },
]


def slugify(text: str) -> str:
    t = unicodedata.normalize("NFKD", text)
    t = t.encode("ascii", "ignore").decode("ascii").lower()
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:72] or "item"


def retail_price(atacado: float) -> float:
    return round(float(atacado) * PRICE_MARKUP, 2)


def image_urls(stem: str) -> list[str]:
    base = f"https://static.cdnlive.com.br/uploads/487/unidade/{stem}"
    return [
        f"{base}.jpg",
        f"{base}_thumb.jpg",
        f"{base}.jpeg",
    ]


def short_description(name: str) -> str:
    return (
        f"{name}. Máscara para fantasias e fetiche — modelagem variada conforme estoque. "
        "Confirme cor e disponibilidade no WhatsApp."
    )


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def merge_gall_records(new_items: list[dict]) -> None:
    existing = load_existing()
    kept = [p for p in existing if not str(p.get("id", "")).startswith(ID_PREFIX)]
    by_id = {p["id"]: p for p in existing if str(p.get("id", "")).startswith(ID_PREFIX)}
    for item in new_items:
        old = by_id.get(item["id"])
        if old:
            if old.get("published") is not None:
                item["published"] = old["published"]
            if old.get("active") is not None:
                item["active"] = old["active"]
            if old.get("createdAt"):
                item["createdAt"] = old["createdAt"]
        else:
            item.setdefault("createdAt", now_iso())
        item["updatedAt"] = now_iso()
    merged = kept + new_items
    OUT_JSON.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")


def fetch_image(stem: str, dest: Path, *, remover_fundo: bool, threshold: int, softness: int) -> bool:
    for url in image_urls(stem):
        if download_and_process_image(
            url,
            dest,
            remover_fundo=remover_fundo,
            threshold=threshold,
            softness=softness,
        ):
            return True
        time.sleep(0.2)
    return False


def build_record(
    item: dict,
    *,
    rank: int,
    remover_fundo: bool,
    threshold: int,
    softness: int,
    skip_images: bool,
) -> dict:
    pid = slugify(item["name"])
    product_id = f"{ID_PREFIX}{pid}"
    local_image = None
    if not skip_images:
        dest = IMG_DIR / f"{product_id.replace(ID_PREFIX, '')}.png"
        if fetch_image(
            item["image"],
            dest,
            remover_fundo=remover_fundo,
            threshold=threshold,
            softness=softness,
        ):
            local_image = f"/importados/catalogo/{SLUG}/{dest.name}"

    price = retail_price(item["price_atacado"])
    return {
        "id": product_id,
        "name": item["name"],
        "ref": item.get("grupo", "").upper().replace("-", "")[:12] or None,
        "price": price,
        "category": LABEL,
        "categorySlug": SLUG,
        "subcategoria": "Máscaras",
        "description": short_description(item["name"]),
        "image": local_image,
        "page": None,
        "source": SOURCE_LABEL,
        "importSource": "gall",
        "importRank": rank,
        "published": bool(local_image),
        "active": True,
        "origem": "Gall — máscaras sensuais",
    }


def main() -> None:
    ap = argparse.ArgumentParser(description="Importa máscaras Gall (curadas) para sado")
    ap.add_argument("--sem-imagem", action="store_true", help="Não baixa imagens")
    ap.add_argument("--com-fundo", action="store_true", help="Mantém fundo da foto")
    ap.add_argument("--fundo-limite", type=int, default=242)
    ap.add_argument("--fundo-suave", type=int, default=20)
    args = ap.parse_args()

    remover_fundo = not args.com_fundo
    IMG_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Importando {len(CURATED)} mascaras Gall para {SLUG} (markup {PRICE_MARKUP}x)")
    records = []
    for i, item in enumerate(CURATED):
        rec = build_record(
            item,
            rank=i,
            remover_fundo=remover_fundo,
            threshold=args.fundo_limite,
            softness=args.fundo_suave,
            skip_images=args.sem_imagem,
        )
        records.append(rec)
        status = "com foto" if rec.get("image") else "sem foto"
        print(f"  [{i + 1}/{len(CURATED)}] {rec['name'][:50]} - R$ {rec['price']:.2f} ({status})")

    merge_gall_records(records)
    com_img = sum(1 for r in records if r.get("image"))
    print(f"\nSalvo em {OUT_JSON.name}: {len(records)} produtos ({com_img} com imagem)")
    print(f"Fonte: {SOURCE_URL}")
    print("Abra /sado no site novo para conferir.")


if __name__ == "__main__":
    main()
