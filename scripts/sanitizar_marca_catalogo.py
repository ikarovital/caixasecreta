# -*- coding: utf-8 -*-
"""
Remove referências a Miess e Caixa Secreta do catálogo importado e renomeia paths/ids.

Uso: python scripts/sanitizar_marca_catalogo.py
"""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
IMPORTADO_JSON = BASE / "frontend" / "src" / "data" / "catalogo-importado.json"
LINGerie_JSON = BASE / "frontend" / "src" / "data" / "catalogo-lingerie.json"
IMG_OLD = BASE / "frontend" / "public" / "importados" / "miess"
IMG_NEW = BASE / "frontend" / "public" / "importados" / "catalogo"

SOURCE_LABEL = "Catálogo importado — preço de referência no WhatsApp"


def clean_text(text: str) -> str:
    if not text:
        return text
    text = re.sub(r"https?://(?:www\.|secure\.)?miess\.com\.br\S*", "", text, flags=re.I)
    text = re.sub(r"miess\.vtexcommercestable\.com\.br\S*", "", text, flags=re.I)
    rules = [
        (r"Clube Caixa Secreta", "Clube"),
        (r"Caixa Secreta", "Clube"),
        (r"CAIXA SECRETA", "CLUBE"),
        (r"Miess Prime", "programa atacado"),
        (r"na Miess", "na loja"),
        (r"presentes na Miess", "disponíveis na loja"),
        (r"linha Miess", "nossa linha"),
        (r"Catálogo Miess[^\n—]*", SOURCE_LABEL),
        (r"referência Miess[^\n.]*", "preço de referência no WhatsApp"),
        (r"\bMiess\b", "nossa loja"),
        (r"\bmiess\b", "nossa loja"),
    ]
    for pattern, repl in rules:
        text = re.sub(pattern, repl, text, flags=re.I)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def sanitize_product(product: dict) -> dict:
    p = dict(product)

    pid = p.get("id") or ""
    if pid.startswith("miess-"):
        p["id"] = "imp-" + pid[6:]

    img = p.get("image") or ""
    if "/importados/miess/" in img:
        p["image"] = img.replace("/importados/miess/", "/importados/catalogo/")

    if p.get("description"):
        p["description"] = clean_text(p["description"])

    src = p.get("source") or ""
    if src and ("miess" in src.lower() or "Miess" in src):
        p["source"] = SOURCE_LABEL

    if p.get("importSource") == "miess":
        p["importSource"] = "importado"

    p.pop("importUrl", None)
    p.pop("importListUrl", None)

    for key in ("name", "category"):
        if p.get(key):
            p[key] = clean_text(str(p[key]))

    return p


def sanitize_lingerie(product: dict) -> dict:
    p = dict(product)
    if p.get("description"):
        p["description"] = clean_text(p["description"])
    if p.get("source"):
        p["source"] = clean_text(str(p["source"]))
    if p.get("name"):
        p["name"] = clean_text(str(p["name"]))
    return p


def migrate_images() -> None:
    if not IMG_OLD.exists():
        return
    IMG_NEW.mkdir(parents=True, exist_ok=True)
    for item in IMG_OLD.iterdir():
        dest = IMG_NEW / item.name
        if item.is_dir():
            if dest.exists():
                for f in item.rglob("*"):
                    if f.is_file():
                        rel = f.relative_to(item)
                        target = dest / rel
                        target.parent.mkdir(parents=True, exist_ok=True)
                        if not target.exists():
                            shutil.copy2(f, target)
            else:
                shutil.copytree(item, dest)
        elif item.is_file() and not dest.exists():
            shutil.copy2(item, dest)


def main() -> None:
    importado = json.loads(IMPORTADO_JSON.read_text(encoding="utf-8"))
    importado = [sanitize_product(p) for p in importado]
    IMPORTADO_JSON.write_text(json.dumps(importado, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"catalogo-importado.json: {len(importado)} produtos sanitizados")

    lingerie = json.loads(LINGerie_JSON.read_text(encoding="utf-8"))
    lingerie = [sanitize_lingerie(p) for p in lingerie]
    LINGerie_JSON.write_text(json.dumps(lingerie, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"catalogo-lingerie.json: {len(lingerie)} produtos revisados")

    migrate_images()
    if IMG_OLD.exists() and IMG_NEW.exists():
        print(f"Imagens: {IMG_OLD} -> {IMG_NEW}")

    raw = IMPORTADO_JSON.read_text(encoding="utf-8")
    hits = len(re.findall(r"miess", raw, re.I))
    print(f"Referencias 'miess' restantes no JSON importado: {hits}")


if __name__ == "__main__":
    main()
