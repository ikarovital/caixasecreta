# -*- coding: utf-8 -*-
"""Garante campos de curadoria (published, active, datas) nos JSONs."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
FILES = [
    BASE / "frontend" / "src" / "data" / "catalogo-lingerie.json",
    BASE / "frontend" / "src" / "data" / "catalogo-importado.json",
]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def default_published(product: dict) -> bool:
    return bool(product.get("image"))


def apply_file(path: Path) -> tuple[int, int, int]:
    items = json.loads(path.read_text(encoding="utf-8"))
    pub = hidden = 0
    now = utc_now()
    for p in items:
        if "published" not in p:
            p["published"] = default_published(p)
        if "active" not in p:
            p["active"] = True
        if not p.get("createdAt"):
            p["createdAt"] = now
        if not p.get("updatedAt"):
            p["updatedAt"] = p["createdAt"]
        if p["published"]:
            pub += 1
        else:
            hidden += 1
    path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    return len(items), pub, hidden


def main() -> None:
    total = pub = hidden = 0
    for path in FILES:
        if not path.exists():
            print(f"SKIP {path.name} (nao encontrado)")
            continue
        n, p, h = apply_file(path)
        total += n
        pub += p
        hidden += h
        print(f"{path.name}: {n} produtos | publicados {p} | ocultos {h}")
    print(f"TOTAL: {total} | publicados {pub} | ocultos {hidden}")


if __name__ == "__main__":
    main()
