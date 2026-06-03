# -*- coding: utf-8 -*-
"""Exporta todo o catálogo (incluindo ocultos) para planilha Excel."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from catalogo_planilha import DEFAULT_XLSX, export_catalog


def main() -> None:
    ap = argparse.ArgumentParser(description="Exporta catálogo para Excel (.xlsx)")
    ap.add_argument(
        "-o",
        "--output",
        type=Path,
        default=DEFAULT_XLSX,
        help=f"Arquivo de saída (padrão: {DEFAULT_XLSX})",
    )
    args = ap.parse_args()

    total, path = export_catalog(args.output)
    print(f"Exportados {total} produtos -> {path}")


if __name__ == "__main__":
    main()
