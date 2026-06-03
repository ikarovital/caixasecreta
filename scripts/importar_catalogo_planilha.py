# -*- coding: utf-8 -*-
"""Importa planilha Excel e atualiza catalogo-lingerie.json + catalogo-importado.json."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from catalogo_planilha import DEFAULT_XLSX, import_catalog


def main() -> None:
    ap = argparse.ArgumentParser(description="Importa catálogo a partir de Excel (.xlsx)")
    ap.add_argument(
        "-i",
        "--input",
        type=Path,
        default=DEFAULT_XLSX,
        help=f"Planilha de entrada (padrão: {DEFAULT_XLSX})",
    )
    args = ap.parse_args()

    stats = import_catalog(args.input)
    print(f"Linhas processadas: {stats['rows']}")
    print(f"Atualizados: {stats['updated']} | Novos: {stats['created']}")
    print(f"Total lingerie: {stats['total_lingerie']} | Total importado: {stats['total_importado']}")
    print("Catálogo JSON atualizado. Recarregue o site (VER-SITE-NOVO.bat).")


if __name__ == "__main__":
    main()
