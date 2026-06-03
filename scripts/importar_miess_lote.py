# -*- coding: utf-8 -*-
"""Importa várias categorias Miess em sequência."""
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
SCRIPT = BASE / "scripts" / "importar_miess.py"

LOTE = [
    {
        "slug": "vibradores",
        "path": "sex-shop/vibrador",
        "titulo": "Vibradores",
        "url": "https://www.miess.com.br/sex-shop/vibrador?O=OrderByTopSaleDESC",
    },
    {
        "slug": "acessorios",
        "path": "sex-shop/acessorios",
        "titulo": "Acessórios",
        "url": "https://www.miess.com.br/sex-shop/acessorios?O=OrderByTopSaleDESC",
    },
    {
        "slug": "cosmeticos",
        "path": "sex-shop/cosmeticos",
        "titulo": "Cosméticos",
        "url": "https://www.miess.com.br/sex-shop/cosmeticos?O=OrderByTopSaleDESC",
    },
    {
        "slug": "sado",
        "path": "sex-shop/fetiche-e-sado",
        "titulo": "Fetiche e Sado",
        "url": "https://www.miess.com.br/sex-shop/fetiche-e-sado?O=OrderByTopSaleDESC",
    },
]

PAGINAS = 4
POR_PAGINA = 24


def main() -> None:
    for i, cat in enumerate(LOTE, 1):
        print(f"\n{'=' * 60}\n[{i}/{len(LOTE)}] {cat['titulo']} ({cat['slug']})\n{'=' * 60}")
        cmd = [
            sys.executable,
            str(SCRIPT),
            "--slug",
            cat["slug"],
            "--path",
            cat["path"],
            "--titulo",
            cat["titulo"],
            "--url",
            cat["url"],
            "--paginas",
            str(PAGINAS),
            "--por-pagina",
            str(POR_PAGINA),
        ]
        r = subprocess.run(cmd, cwd=str(BASE))
        if r.returncode != 0:
            print(f"ERRO na categoria {cat['slug']}", file=sys.stderr)
            sys.exit(r.returncode)
    print("\nLote concluído. Reinicie VER-SITE-NOVO.bat")


if __name__ == "__main__":
    main()
