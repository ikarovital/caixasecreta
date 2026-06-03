# -*- coding: utf-8 -*-
"""Gera frontend/src/data/catalogo-lingerie.json a partir da extração PDF."""
import hashlib
import json
import os
import re
import statistics
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parents[1]
EXTRACAO = BASE / "dados" / "extracao_pdf"
OUT = BASE / "frontend" / "src" / "data" / "catalogo-lingerie.json"
BLACKLIST_FILE = EXTRACAO / "_imagens_compartilhadas.json"

CAT_LABELS = {
    "calcinhas": "Calcinhas",
    "conjuntos": "Conjuntos",
    "espartilhos": "Espartilhos",
    "fantasias": "Fantasias",
    "sado": "Sado",
    "sex-shop": "Sex Shop",
    "vibradores": "Vibradores",
}

CAT_ORDER = [
    "calcinhas",
    "conjuntos",
    "espartilhos",
    "fantasias",
    "vibradores",
    "sado",
]

# Pasta da extração PDF → slug no site (sex-shop entra em comestíveis)
PDF_FOLDER_TO_SLUG = {
    "sex-shop": "comestiveis",
}

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def build_shared_image_blacklist() -> set[str]:
    hash_folders: dict[str, set[str]] = defaultdict(set)
    hash_in_category: dict[str, dict[str, set[str]]] = defaultdict(lambda: defaultdict(set))
    for path in EXTRACAO.rglob("*"):
        if path.suffix.lower() not in IMAGE_EXTS or not path.is_file():
            continue
        digest = file_hash(path)
        hash_folders[digest].add(path.parent.name)
        try:
            cat = path.relative_to(EXTRACAO).parts[0]
        except ValueError:
            continue
        hash_in_category[cat][digest].add(path.parent.name)

    shared = {h for h, folders in hash_folders.items() if len(folders) >= 2}
    for cat, by_hash in hash_in_category.items():
        for digest, folders in by_hash.items():
            if len(folders) >= 2:
                shared.add(digest)
    samples = []
    for path in EXTRACAO.rglob("*"):
        if path.suffix.lower() not in IMAGE_EXTS:
            continue
        if file_hash(path) in shared:
            samples.append(str(path.relative_to(EXTRACAO)).replace("\\", "/"))
    BLACKLIST_FILE.write_text(
        json.dumps({"total": len(shared), "exemplos": samples[:30]}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return shared


def image_metrics(path: Path) -> dict | None:
    try:
        with Image.open(path) as im:
            im = im.convert("RGB")
            w, h = im.size
            if w < 220 or h < 220:
                return None
            ar = w / h
            sample = im.resize((100, max(50, int(100 * h / w))))
            px = list(sample.getdata())
    except OSError:
        return None

    grays = [sum(p) / 3 for p in px]
    std = statistics.pstdev(grays) if len(grays) > 1 else 0
    buckets = Counter((r // 32, g // 32, b // 32) for r, g, b in px)
    dom = buckets.most_common(1)[0][1] / len(px)
    return {"w": w, "h": h, "ar": ar, "std": std, "dom": dom, "area": w * h}


def photo_score(metrics: dict, filename: str, category: str = "") -> float:
    ar, std, dom, area = metrics["ar"], metrics["std"], metrics["dom"], metrics["area"]
    score = std * (1.15 - min(dom, 0.7))
    if category in ("calcinhas", "espartilhos"):
        if 0.48 <= ar <= 0.92:
            score *= 1.85
        if 80_000 <= area <= 520_000:
            score *= 2.2
        if area > 1_200_000:
            score *= 0.06
        elif area > 700_000:
            score *= 0.2
        if re.search(r"_foto\.(jpe?g|png|webp)$", filename, re.I):
            score *= 5.0
        if re.search(r"_img3\.(jpe?g|png|webp)$", filename, re.I):
            score *= 3.2
        if re.search(r"_img2\.(jpe?g|png|webp)$", filename, re.I):
            score *= 1.35
        if re.search(r"_img1\.(jpe?g|png|webp)$", filename, re.I):
            score *= 0.5
    if 0.55 <= ar <= 0.95:
        score *= 1.45
    if category in ("conjuntos", "fantasias"):
        if area >= 280_000:
            score *= 1.85
        if area >= 450_000:
            score *= 1.25
        if category == "conjuntos" and 0.50 <= ar <= 1.05:
            score *= 1.2
        if category == "fantasias" and 0.48 <= ar <= 1.0:
            score *= 1.25
    if 80_000 <= area <= 520_000:
        score *= 1.2
    if area > 650_000:
        score *= 0.15
    if dom > 0.55:
        score *= 0.2
    if ar > 1.2:
        score *= 0.25
    if std < 28:
        score *= 0.5
    if re.search(r"_img1\.(jpe?g|png|webp)$", filename, re.I):
        score *= 0.45
    if re.search(r"_col[12]_img1\.(jpe?g|png|webp)$", filename, re.I):
        score *= 0.2
    if re.search(r"_img[23]\.(jpe?g|png|webp)$", filename, re.I):
        score *= 1.15
    return score


def image_limits(category: str, strict: bool = True) -> dict:
    """Limites para foto de produto (evita faixas do PDF e fundos lisos)."""
    if category == "fantasias":
        if strict:
            return {"ar_min": 0.48, "ar_max": 1.0, "std_min": 40, "dom_max": 0.40}
        return {"ar_min": 0.45, "ar_max": 1.05, "std_min": 35, "dom_max": 0.45}
    if category == "conjuntos":
        if strict:
            return {"ar_min": 0.40, "ar_max": 1.15, "std_min": 26, "dom_max": 0.55}
        return {"ar_min": 0.35, "ar_max": 1.20, "std_min": 22, "dom_max": 0.60}
    return {"ar_min": 0.42, "ar_max": 1.12, "std_min": 30, "dom_max": 0.52}


def passes_photo_filter(metrics: dict, limits: dict) -> bool:
    ar, std, dom = metrics["ar"], metrics["std"], metrics["dom"]
    if ar < limits["ar_min"] or ar > limits["ar_max"]:
        return False
    if std < limits["std_min"] or dom > limits["dom_max"]:
        return False
    if metrics["area"] > 620_000 and std < 55:
        return False
    return True


def collect_image_paths(imagens: list, pasta: str = "") -> list[Path]:
    paths: list[Path] = []
    seen: set[str] = set()
    for im in imagens:
        rel = (im.get("arquivo") or "").replace("dados/extracao_pdf/", "").replace("\\", "/").lstrip("/")
        if not rel:
            continue
        path = EXTRACAO / rel
        key = str(path.resolve()).lower()
        if path.exists() and key not in seen:
            seen.add(key)
            paths.append(path)
    if pasta:
        folder = BASE / pasta.replace("/", os.sep)
        if folder.is_dir():
            for path in sorted(folder.iterdir()):
                if path.suffix.lower() not in IMAGE_EXTS or not path.is_file():
                    continue
                if "cutout" in path.stem.lower():
                    continue
                key = str(path.resolve()).lower()
                if key not in seen:
                    seen.add(key)
                    paths.append(path)
    return paths


def pick_image(imagens: list, blacklist: set[str], category: str = "", pasta: str = "") -> str | None:
    paths = collect_image_paths(imagens, pasta)
    if not paths:
        return None
    foto_paths = [p for p in paths if p.stem.endswith("_foto")]
    if foto_paths:
        for path in sorted(foto_paths, key=lambda p: p.stat().st_size, reverse=True):
            m = image_metrics(path)
            if m and m["w"] >= 180 and m["h"] >= 180:
                rel = str(path.relative_to(EXTRACAO)).replace("\\", "/")
                return "/extracao_pdf/" + rel
    strict_modes = (True, False) if category in ("fantasias", "conjuntos") else (True,)
    for strict in strict_modes:
        limits = image_limits(category, strict=strict)
        candidates = []
        for path in paths:
            rel = str(path.relative_to(EXTRACAO)).replace("\\", "/")
            if not path.exists():
                continue
            digest = file_hash(path)
            if digest in blacklist:
                continue
            m = image_metrics(path)
            if not m or not passes_photo_filter(m, limits):
                continue
            score = photo_score(m, path.name, category)
            candidates.append((score, m["area"], rel))
        if candidates:
            break

    if not candidates:
        for path in paths:
            rel = str(path.relative_to(EXTRACAO)).replace("\\", "/")
            m = image_metrics(path)
            if not m or m["w"] < 180 or m["h"] < 180:
                continue
            candidates.append((0, m["area"], rel))

    if not candidates and category in ("conjuntos", "fantasias"):
        fallback = []
        for path in paths:
            rel = str(path.relative_to(EXTRACAO)).replace("\\", "/")
            m = image_metrics(path)
            if not m or m["w"] < 220 or m["h"] < 220:
                continue
            fallback.append((m["area"], rel))
        if fallback:
            return "/extracao_pdf/" + max(fallback, key=lambda x: x[0])[1]

    if not candidates:
        return None
    if category in ("calcinhas", "espartilhos"):
        best = max(candidates, key=lambda x: (x[0], -x[1]))
    elif category in ("conjuntos", "fantasias", "cosmeticos", "acessorios", "vibradores", "sado", "comestiveis"):
        best = max(candidates, key=lambda x: (x[1], x[0]))
    else:
        best = max(candidates, key=lambda x: (x[1], x[0]))
    return "/extracao_pdf/" + best[2]


def build_description(raw: dict) -> str:
    desc = (raw.get("descricao") or "").strip()
    texto = (raw.get("texto_completo") or "").strip()
    if len(desc) >= 30:
        return desc[:500]
    if not texto:
        return desc
    lines = [ln.strip() for ln in texto.splitlines() if ln.strip()]
    nome = (raw.get("nome") or "").strip()
    cleaned = []
    for ln in lines:
        low = ln.lower()
        if nome and ln == nome:
            continue
        if re.match(r"^ref\s*[:.]?\s*\d+", low):
            continue
        if re.search(r"r\$\s*[\d.,]+", low):
            continue
        if re.search(r"catalogo|atacado|vendedoras", low):
            continue
        cleaned.append(ln)
    merged = "\n".join(cleaned).strip()
    return (merged or desc)[:500]


def slug_id(cat: str, ref: str | None, pasta: str, nome: str) -> str:
    base = ref or re.sub(r"[^a-z0-9]+", "-", nome.lower()).strip("-") or "item"
    folder = Path(pasta).name if pasta else base
    return f"{cat}-{base}-{folder}"[:120]


def load_existing_products() -> dict[str, dict]:
    if not OUT.exists():
        return {}
    try:
        items = json.loads(OUT.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    return {p["id"]: p for p in items if p.get("id")}


def default_published(has_image: bool, override: bool | None) -> bool:
    if override is not None:
        return override
    return has_image


def discover_categories():
    found = []
    if EXTRACAO.exists():
        for d in EXTRACAO.iterdir():
            if d.is_dir() and (d / "_catalogo.json").exists():
                found.append(d.name)
    ordered = [c for c in CAT_ORDER if c in found]
    ordered += sorted(c for c in found if c not in ordered)
    return [(c, CAT_LABELS.get(PDF_FOLDER_TO_SLUG.get(c, c), c.replace("-", " ").title()), PDF_FOLDER_TO_SLUG.get(c, c)) for c in ordered]


def main() -> None:
    blacklist = build_shared_image_blacklist()
    print(f"Imagens compartilhadas bloqueadas: {len(blacklist)}")

    existing_products = load_existing_products()
    products = []
    with_image = 0
    published_count = 0
    for folder, label, slug in discover_categories():
        items = json.loads((EXTRACAO / folder / "_catalogo.json").read_text(encoding="utf-8"))
        for i, raw in enumerate(items):
            nome = raw.get("nome") or f"Produto {i + 1}"
            if nome.startswith("produto-pagina"):
                m = re.search(r"ref\s*[:.]?\s*(\d+)", raw.get("texto_completo", ""), re.I)
                if m:
                    nome = f"Ref {m.group(1)}"
            try:
                price = float(raw.get("preco") or 0)
            except (TypeError, ValueError):
                price = 0
            desc = build_description(raw)
            if len(desc) > 500:
                desc = desc[:497] + "…"
            img = pick_image(raw.get("imagens") or [], blacklist, slug, raw.get("pasta") or "")
            if img:
                with_image += 1
            pid = slug_id(slug, raw.get("ref"), raw.get("pasta", ""), nome)
            old = existing_products.get(pid, {})
            had_image = bool(old.get("image"))
            if img and old.get("active", True) is not False and (
                slug
                in (
                    "conjuntos",
                    "fantasias",
                    "cosmeticos",
                    "acessorios",
                    "vibradores",
                    "sado",
                    "comestiveis",
                    "calcinhas",
                    "espartilhos",
                )
                or old.get("published") is not False
            ):
                published = True
            elif img and old.get("published") is False and not had_image:
                published = True
            else:
                published = default_published(
                    bool(img), old.get("published") if "published" in old else None
                )
            if published:
                published_count += 1
            now_fields = {}
            if old.get("createdAt"):
                now_fields["createdAt"] = old["createdAt"]
            if old.get("updatedAt"):
                now_fields["updatedAt"] = old["updatedAt"]
            products.append(
                {
                    "id": pid,
                    "name": nome,
                    "ref": raw.get("ref"),
                    "price": price,
                    "category": label,
                    "categorySlug": slug,
                    "description": desc,
                    "image": img,
                    "page": raw.get("pagina"),
                    "source": raw.get("fonte_pdf"),
                    "published": published,
                    "active": old.get("active", True),
                    **now_fields,
                    **{k: old[k] for k in ("stock", "listPrice") if k in old},
                }
            )

    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(products)} produtos -> {OUT}")
    print(f"Com foto valida: {with_image} | Sem foto: {len(products) - with_image}")
    print(f"Publicados: {published_count} | Ocultos: {len(products) - published_count}")


if __name__ == "__main__":
    main()
